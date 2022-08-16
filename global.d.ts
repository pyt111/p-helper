// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // ElAffix: typeof import('p-helper')['ElAffix']
    TestComponent: typeof import('p-helper')['TestComponent']
  }

  interface ComponentCustomProperties {
    // $message: typeof import('p-helper')['ElMessage']
  }
}

export {}
