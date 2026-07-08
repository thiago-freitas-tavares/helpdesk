import Vue from 'vue'
import { Store } from 'vuex'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: Store<any>
  }
}