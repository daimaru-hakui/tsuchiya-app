const paths = {
  home() {
    return "/";
  },
  productAll() {
    return `/products`;
  },
  productShow(id: string) {
    return `/products/${id}`;
  },
  productNew() {
    return `/products/new`;
  },
  orderAll() {
    return `/orders`;
  },
  orderShow(id: string) {
    return `/orders/${id}`;
  }
};

export default paths;