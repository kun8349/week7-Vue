<template>
    <p>這是購物車</p>
    <table class="table align-middle">
        <thead>
            <tr>
                <th width="50px"></th>
                <th scope="col" class="text-center">品名</th>
                <th scope="col" width="100px">單價</th>
                <th scope="col" width="220px"  class="text-center">數量/單位</th>
                <th width="150px"></th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <template v-if="cartList.length !== 0">
                <tr v-for="cartProduct in cartList" :key="cartProduct.id">
                    <td>
                        <button type="button" class="btn btn-outline-danger btn-sm"
                         @click="() => deleteSingle(cartProduct)"
                         :disabled="loadingItem === cartProduct.id">
                        <!---->
                        X
                        </button>
                    </td>
                    <td class="text-center">
                        {{ cartProduct.product.title }}
                    </td>
                    <td class="fs-5">
                        {{ cartProduct.product.price }}
                    </td>
                    <td class="">
                        <div class="input-group w-50">
                            <input v-model="cartProduct.qty" type="number" min="1" class="form-control"
                            @change="() => editNum(cartProduct)"
                            :disabled="loadingItem === cartProduct.id">
                            <!---->
                            <span class="input-group-text">
                                {{ cartProduct.product.unit }}
                            </span>
                        </div>
                    </td>
                    <td class="text-end fs-5">
                        ${{ cartProduct.total }}
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="fs-5 text-end fw-bold">
                        總計：
                        ${{ total }}
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td>
                    </td>
                    <td class="text-secondary text-end">
                        <h3 class="mt-3">購物車目前沒東西!  叉滴~</h3>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
        </tbody>
    </table>
    <div class="my-5 row justify-content-center">
      <v-form
        ref="form"
        class="col-md-6"
        v-slot="{ errors }"
        @submit="order"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            class="form-control"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="data.user.email"
            :class="{ 'is-invalid': errors['email'] }"
          >
          </Field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <Field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            placeholder="請輸入姓名"
            rules="required|min:2"
            v-model="data.user.name"
            :class="{ 'is-invalid': errors['姓名'] }"
          >
          </Field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <Field
            id="tel"
            name="電話"
            type="text"
            class="form-control"
            placeholder="請輸入電話"
            rules="required|numeric|min:8"
            v-model="data.user.tel"
            :class="{ 'is-invalid': errors['電話'] }"
          >
          </Field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <Field
            id="address"
            name="地址"
            type="text"
            class="form-control"
            placeholder="請輸入地址"
            rules="required"
            v-model="data.user.address"
            :class="{ 'is-invalid': errors['地址'] }"
          >
          </Field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            style="resize:none; height: 200px; overflow-y: auto;"
            v-model="data.message"
          >
          </textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </v-form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import VeeValidateRules from '@vee-validate/rules'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import Swal from 'sweetalert2'
Object.keys(VeeValidateRules).forEach((rule) => {
  defineRule(rule, VeeValidateRules[rule])
})
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true
})
setLocale('zh_TW')
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      cartList: {},
      loadingItem: '',
      total: 0,
      data: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  components: {
    Field,
    VForm: Form,
    ErrorMessage
  },
  methods: {
    getCart () {
      this.$http.get(`${VITE_URL}api/${VITE_PATH}/cart`)
        .then(res => {
          this.cartList = res.data.data.carts
          this.total = res.data.data.total
        })
    },
    deleteSingle (product) {
      this.loadingItem = product.id
      this.$http.delete(`${VITE_URL}api/${VITE_PATH}/cart/${product.id}`)
        .then(res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '成功刪除單一產品d(`･∀･)b',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          })
          this.getCart()
          this.loadingItem = ''
        })
        .catch(() => {
          Swal.fire({
            icon: 'success',
            title: '刪除單一品項失敗٩(ŏ﹏ŏ、)۶',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    editNum (product) {
      const data = {
        product_id: product.id,
        qty: product.qty
      }
      this.loadingItem = product.id
      this.$http.put(`${VITE_URL}api/${VITE_PATH}/cart/${product.id}`, { data })
        .then(res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '成功加入購物車(｡◕∀◕｡)',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          })
          this.getCart()
          this.loadingItem = ''
        })
        .catch(() => {
          Swal.fire({
            icon: 'success',
            title: '加入購物車失敗(｡ŏ_ŏ)',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    order () {
      const orderList = this.data
      this.$http.post(`${VITE_URL}api/${VITE_PATH}/order`, { data: orderList })
        .then(res => {
          this.data = {
            user: {
              name: '',
              email: '',
              tel: '',
              address: ''
            },
            message: ''
          }
          this.getCartList()
          Swal.fire({
            icon: 'success',
            title: '訂單建立成功d(`･∀･)b',
            showConfirmButton: false,
            timer: 1000
          })
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: '訂單建立失敗٩(ŏ﹏ŏ、)۶',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>
