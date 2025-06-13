import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  console.log('searchParams:', searchParams.toString());
  
  const success = searchParams.get('success') === 'true';
  console.log('PaymentResult component rendered with success:', success);

  return success ? <PaymentSuccess /> : <PaymentFailure />;
};

export default PaymentResult;