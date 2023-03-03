<template>
    <h2 class="text-center">
      產品列表
    </h2>
    <table class="table text-start align-middle">
      <thead>
        <tr>
          <th scope="col">圖片</th>
          <th scope="col">產品名稱</th>
          <th scope="col">價格</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="product in products" :key="product.id">
          <td width="150px">
            <img :src="product.imageUrl" alt="主要圖片" class="img-fluid">
          </td>
          <td>{{ product.title }}</td>
          <td class="fs-5">${{ product.price }}</td>
          <td class="text-center">
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <router-link :to="`/product/${product.id}`" type="button" class="btn btn-sm btn-outline-dark"
              :class="{routerDisabled : loadingItem === product.id}">
                查看更多
              </router-link>
              <button type="button" class="btn btn-sm btn-outline-primary" @click="() => addCart(product.id)"
                :disabled="loadingItem === product.id">
                加入購物車
                <img src="../../assets/loading.gif" alt="loading" width="20" v-if="loadingItem === product.id">
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import Swal from 'sweetalert2'
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      products: {},
      loadingItem: ''
    }
  },
  methods: {
    getProducts () {
      this.$http.get(`${VITE_URL}api/${VITE_PATH}/products`)
        .then(res => {
          this.products = res.data.products
          this.isLoading = false
        })
    },
    addCart (item) {
      const data = {
        product_id: item,
        qty: 1
      }
      this.loadingItem = item
      this.$http.post(`${VITE_URL}api/${VITE_PATH}/cart`, { data })
        .then(res => {
          this.isLoading = false
          this.loadingItem = ''
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '加入購物車成功(ﾉ>ω<)ﾉ',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          })
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: '加入購物車失敗(‘⊙д-)',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>

<style>
.routerDisabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
