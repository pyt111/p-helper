// For this project development
import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    // ElAffix: typeof import('../packages/p-helper')['ElAffix'],
    TestComponent: typeof import('../packages/p-helper')['TestComponent'],
  }

  interface ComponentCustomProperties {
    // $message: typeof import('../packages/p-helper')['ElMessage']
  }
}

export {}
