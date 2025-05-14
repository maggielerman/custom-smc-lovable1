
import BookCheckout from "./checkout/BookCheckout";

// This wrapper passes the props from parent components to the actual implementation
const BookCheckoutWrapper = (props: any) => {
  return <BookCheckout {...props} />;
};

export default BookCheckoutWrapper;
