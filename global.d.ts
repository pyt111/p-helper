// GlobalComponents for Volar

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // ElAffix: typeof import('p-helper')['ElAffix']
    TestComponent: typeof import('@p-helper/components')['TestComponent'];
    PWaterfall: typeof import('@p-helper/components')['PWaterfall'];
  }

  // interface ComponentCustomProperties {
  //   // $message: typeof import('p-helper')['ElMessage']
  // }
}

export {};
