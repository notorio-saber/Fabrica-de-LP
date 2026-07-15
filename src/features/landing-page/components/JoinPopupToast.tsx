import { useEffect, useRef, useState } from 'react';
import whatsappIcon from '../assets/icons/whatsapp.svg';

const NAMES = [
  'Camila entrou no grupo',
  'Juliana entrou no grupo',
  'Fernanda entrou no grupo',
  'Patrícia entrou no grupo',
  'Aline entrou no grupo',
  'Mariana entrou no grupo',
  'Bruna entrou no grupo',
  'Larissa entrou no grupo',
  'Tatiane entrou no grupo',
  'Gabriela entrou no grupo',
];

export function JoinPopupToast() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(NAMES[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    const showPopup = () => {
      setText(NAMES[indexRef.current]);
      setVisible(true);
      indexRef.current = (indexRef.current + 1) % NAMES.length;
      setTimeout(() => setVisible(false), 6000);
    };

    const interval = setInterval(showPopup, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="julia-join-popup" style={{ display: visible ? 'flex' : 'none' }}>
      <img src={whatsappIcon} alt="WhatsApp" />
      <span>{text}</span>
    </div>
  );
}
