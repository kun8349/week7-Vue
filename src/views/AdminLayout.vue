<template>
    <div class="bg-dark">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid  d-flex justify-content-center">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav d-flex me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link text-white" to="/admin/product">產品列表</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-white" to="/admin/order">訂單</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-white" to="/admin/coupon">優惠券</router-link>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <a href="" class="nav-link fs-5 fw-bold text-white" @click="()=>logout">登出</a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div>
        <router-view/>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
const { VITE_URL } = import.meta.env
export default {
  data () {
    return {

    }
  },
  methods: {
    check () {
      this.$http.post(`${VITE_URL}api/user/check`)
        .then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '驗證成功(｡◕∀◕｡)',
            showConfirmButton: false,
            timer: 1000,
            toast: true
          })
        })
        .catch(() => {
          this.$router.push('/')
          Swal.fire({
            icon: 'error',
            title: '登入失敗',
            showConfirmButton: false,
            timer: 1000
          })
        })
    },
    logout () {
      document.cookie = `myToken=;expires=${new Date()}`
      this.$router.push('/')
    }
  },
  mounted () {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    // token 設置在 headers 內，是 axios 包裝好的語法
    this.$http.defaults.headers.common.Authorization = token
    this.check()
  }
}
</script>

<style lang="scss" scoped>

</style>
