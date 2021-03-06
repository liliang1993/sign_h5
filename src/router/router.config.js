/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/sign',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      },
      {
        path: '/sign',
        name: 'Sign',
        component: () => import('@/views/sign'),
        meta: { title: '签名', keepAlive: false }
      },
      {
        path: '/upload-idcard',
        name: 'UploadIDcard',
        component: () => import('@/views/uploadIdCard'),
        meta: { title: '上传身份证', keepAlive: false }
      }
    ]
  }
]
