<template>
    <div class="my-3 text-end">
        <button type="button" class="btn btn-primary" @click="()=>openModal('new')">建立新產品</button>
    </div>
    <table class="table">
        <thead>
            <tr>
            <th width="100px">分類</th>
            <th>產品名稱</th>
            <th width="120px">原價</th>
            <th width="120px">售價</th>
            <th width="100px">是否啟用</th>
            <th width="120px">編輯</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in productList" :key="item.title">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.origin_price }}</td>
            <td>{{ item.price }}</td>
            <td>
                <span class="text-success" v-if="item.is_enabled">啟用</span>
                <span v-else>未啟用</span>
            </td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="()=>openModal('edit',item)">編輯</button>
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="()=>openModal('del',item)">刪除</button>
                </div>
            </td>
            </tr>
        </tbody>
    </table>
    <div class="d-flex justify-content-center">
      <Pagination :pages="pages" @emit-pages="getProducts"></Pagination>
    </div>
    <ProductModal
      @update-product="updateProduct"
      :product="tempProduct"
      :isNew="isNew"
      ref="productModal"
    />
</template>

<script>
import ProductModal from '@/components/ModalProduct.vue'
import Pagination from '@/components/PaginationView.vue'
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      isNew: true,
      productList: [],
      tempProduct: {
        imagesUrl: []
      },
      currentPage: 1,
      pages: {}
    }
  },
  components: {
    ProductModal,
    Pagination
  },
  emits: ['update-product'],
  methods: {
    getProducts (page = 1) {
      this.currentPage = page
      this.$http.get(`${VITE_URL}api/${VITE_PATH}/admin/products/?page=${page}`)
        .then(res => {
          this.productList = res.data.products
          this.pages = res.data.pagination
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    createImg () {
      this.product.imagesUrl = []
      this.product.imagesUrl.push('')
    },
    openModal (type, item) {
      if (type === 'new') {
        this.isNew = true
        this.tempProduct = {
          imagesUrl: []
        }
      } else {
        this.tempProduct = { ...item }
        this.isNew = false
      }
      const productComponent = this.$refs.productModal
      productComponent.openModal()
    }
  },
  updateProduct (item) {
    this.tempProduct = item
    let url = `${VITE_URL}/api/${VITE_PATH}/admin/product`
    let http = 'post'
    if (!this.isNew) {
      url = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`
      http = 'put'
    }
    this.$http[http](url, { data: this.tempProduct })
      .then((response) => {
        alert(response.data.message)
        const productComponent = this.$refs.productModal
        productComponent.hideModal()
        this.getProducts()
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  },
  created () {
    this.getProducts()
  }
}
</script>

<style lang="scss" scoped>

</style>
