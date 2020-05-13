<template>
  <div id="login">
    <navigation :title="title" />

     <transition
      appear
      enter-active-class="animated lightSpeedIn"
      leave-active-class="animated rotateInUpLeft"
      :duration="3000"
    >
    <van-form @submit="onSubmit" class="box-content" ref="form">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="verify"
        name="验证码"
        label="验证码"
        placeholder="验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      />
      <img class="verify" @click.prevent="refresh" ref="codeImg" />
      <div style="margin: 16px;">
        <van-button type="info" size="large" @click="submit">登录</van-button>
        <van-button type="info" size="large" @click="register">注册</van-button>
      </div>
    </van-form>
    <van-row class="bottom-content">
      <van-col class="bottom-bg">温馨提示：登录的用户,默认同意用户协议和隐私政策</van-col>
    </van-row>
    <div v-if="show">
      <h3>请选择要进入系统的角色</h3>
      <div class="btn-wrapper">
        <mu-button
          v-for="(role, index) in roles"
          :key="index"
          color="primary"
          class="btn"
          @click="gotoIndex(role.roleId)"
        >{{ role.roleName }}</mu-button>
      </div>
    </div>
     </transition>
  </div>
</template>

<script>
import navigation from '../components/Common/Navigation'
export default {
  name: 'login',
  data() {
    return {
      title: '登录账号',
      username: '',
      password: '',
      verify: '',
      show: false,
      roles: []
    }
  },
  components: {
    navigation
  },
  created() {
    //调用验证码接口,不使用 responseType: 'blob',会乱码，而且下面需要将流转为图片
    this.axios.get('http://localhost:8080' + '/captcha?name=' + this.username, { responseType: 'blob' }).then((res) => {
      console.log(res.headers)
      console.log(res)
      //获得当前对象，便于后面，赋值给src
      let img = this.$refs.codeImg
      //用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象，本例创建的是Blob对象
      let url = window.URL.createObjectURL(res.data)
      img.src = url
    })
  },
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log('submit', values)
    },
    //验证登录
    submit() {
      //验证表单是否通过
      this.$refs.form.validate().then((result) => {
        console.log('form valid: ', result)
        //请求登录接口,验证账号，密码，验证码
        this.axios({
          method: 'post',
          url: 'http://localhost:8080' + '/sysAdmin/login',
          data: {
            name: this.username,
            password: this.password,
            verifyCode: this.verify
          }
        }).then((res) => {
          console.log(res)
          //“1”代表的就是成功
          if (res.data.code === 1) {
            //将token存入localStorage中(本地存储)
            localStorage.setItem('token', res.data.data.token)
            //传参，可以为值，大部分为对象
            this.$store.commit('setToken', res.data.data.token)
            localStorage.setItem('id', res.data.data.admin.id)
            this.$store.commit('setId', res.data.data.admin.id)
            let admin = {
              id: res.data.data.admin.id,
              name: res.data.data.admin.name,
              role: res.data.data.admin.roles, //有两个角色，暂时先用第一个
              avatar: res.data.data.admin.avatar
            }
            //存admin信息
            localStorage.setItem('admin', JSON.stringify(admin))
            console.log(localStorage.getItem('admin').id)
            this.$store.commit('setAdmin', JSON.stringify(admin))
            this.roles = res.data.data.admin.roles
            //角色数量超过一
            if (this.roles.length > 1) {
              alert('登录成功，你的角色不止一个，请选择')
              //弹出遮罩层,点击跳到对应表单
              this.show = true
            } else {
              //只有一个角色
              const roleId = res.data.data.admin.roles[0].roleId
              localStorage.setItem('roleId', roleId)
              this.$store.commit('setRoleId', roleId)
              alert(roleId)
              this.$router.push({
                path: '/header',
                query: {
                  roleId: roleId
                }
              })
            }
          } else {
            alert(res.data.msg)
            //登录失败，清空验证码文本框
            this.verify = ''
          }
        })
      })
    },
    //点击验证码,进行刷新
    refresh() {
      this.axios
        .get('http://localhost:8080' + '/captcha?name=' + this.username, { responseType: 'blob' })
        .then((res) => {
          let img = this.$refs.codeImg
          let url = window.URL.createObjectURL(res.data)
          img.src = url
        })
    },
    gotoIndex(roleId) {
      //带着用户选择的roleId跳到首页
      localStorage.setItem('roleId', roleId)
      this.$store.commit('setRoleId', roleId)
      alert(roleId)
      this.$router.push({
        path: '/home',
        query: {
          roleId: roleId
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.img {
  margin-left: 17%;
  margin-top: 4%;
}
img {
  border-radius: 50%;
  width: 14rem;
  height: 14rem;
  z-index: 10000;
  animation: change 5s infinite linear;
}
@keyframes change {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
button {
  margin-top: 2rem;
}
span {
  font-size: 1rem;
}
</style>