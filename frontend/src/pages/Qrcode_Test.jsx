import { useEffect, useState } from "react";
import {QRCodeCanvas} from 'qrcode.react';
import generatePayload from "promptpay-qr";

const Qrcode_Test = ({amount,hid}) => {
  const [phoneNumber, setPhoneNumber] = useState("0949706307");
  const [qrCode, setQrCode] = useState("sample");
  useEffect(() => {
    loaddata();
  }, []);
  const loaddata = async () => {
    setQrCode(generatePayload(phoneNumber, { amount }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <p className="m-5 text-2xl font-bold text-[var(--clorblue)]">กรุณาสเเกน</p>
      <QRCodeCanvas value={qrCode} />
      <p className="p-10 text-xl">{Number(amount).toLocaleString()} บาท</p>
      <button onClick={hid} className="w-48 rounded-[8px] h-10 text-white font-bold bg-[var(--clorblue)] cursor-pointer hover:bg-[var(--hoverblue)]">ยืนยัน</button>
    </div>
  );
};

export default Qrcode_Test;
