import { useSearchParams } from "react-router-dom";

const Payment = () => {
  const [searchParams] = useSearchParams();
  console.log('searchParams:', searchParams.toString());
  const success = searchParams.get('success') === 'true';
    console.log('Payment component rendered with success:', success);    
  return (
    <div>
      <h2>
        {success
          ? 'Thanh toán VNPay thành công. Cảm ơn bạn!'
          : 'Thanh toán thất bại hoặc bị hủy.'}
      </h2>
    </div>
  );
};

export default Payment;
