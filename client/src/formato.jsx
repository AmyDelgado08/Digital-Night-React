const conNegrita = (texto) =>
    (texto || '').split('**').map((parte, i) =>
        i % 2 === 1 ? <strong key={i}>{parte}</strong> : parte
    );

export default conNegrita;
