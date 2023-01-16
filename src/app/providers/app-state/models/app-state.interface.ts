export interface AppInfo {
    breadcum: Array<{
      name: string;
      route: string;
      active: boolean;
    }>;
     isLogged: boolean;
     idMenuActive?: string;
   }

export interface Toast {
  type: string;
  msj: string;
}

export interface MenuChild {
  id: any;
  icon: any;
  label: string;
  url: string;
  active: boolean;
}
