<template>
  <div id="login">
    <navigation :title="title" />

    <transition
      appear
      enter-active-class="animated lightSpeedIn"
      leave-active-class="animated rotateInUpLeft"
      :duration="3000"
    >
      <div class="wrap">
        <van-cell-group>
          <van-field
            v-model="phone"
            required
            clearable
            label="手机号"
            placeholder="请输入手机号"
            readonly
            clickable
            @touchstart.native.stop="show = true"
            error
          />
          <van-number-keyboard
            v-model="phone"
            :show="show"
            :maxlength="11"
            @blur="show = false"
          />
          <van-field
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
            error
          />
          <van-button type="info" size="large" @click="userlogin"
            >登录</van-button
          >
          <van-button type="info" size="large" @click="register"
            >注册</van-button
          >
        </van-cell-group>
      </div>
    </transition>
  </div>
</template>

<script>
import navigation from "../components/Common/Navigation";
export default {
  name: "login",
  components: {
    navigation
  },
  data() {
    return {
      title: "登录账号",
      phone: "",
      password: "",
      show: false
    };
  },
  methods: {
    userlogin() {
      if (this.phone == "" || this.password == "") {
        this.$dialog.alert({
          message: "手机号或者密码不能为空!"
        });
      } else {
        this.axios
          .get(
            "/login/cellphone?phone=" +
              this.phone +
              "&password=" +
              this.password
          )
          .then(res => {
            this.$store.state.uid = res.data.account.id;
            // 存入sessionStorage 防止刷新数据消失
            let id = JSON.stringify(res.data.account.id);
            sessionStorage.setItem("uid", id);
            this.$dialog
              .alert({
                message: "登录成功!"
              })
              .then(() => {
                this.$router.push("/sheet");
              });
          });
      }
    },
    register() {
      this.$router.push("/register");
    },
  }
};
</script>
<style scoped>
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
.wrap {
  position: absolute;
  top: 30%;
  width: 100%;
}
button {
  margin-top: 3rem;
}
span {
  font-size: 1rem;
}
</style>
