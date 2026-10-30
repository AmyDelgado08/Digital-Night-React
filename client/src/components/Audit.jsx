import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Audit() {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        axios.get('http://localhost:3000/audit', {
            headers: { authorization: token }
        })
        .then(res => setRegistros(res.data))
        .catch(() => {
            alert('No tienes permisos de administrador para ver esta sección.');
            navigate('/perfil-publico');
        });
    }, [navigate]);

    const colorEstado = (estado) => {
        if (estado === 429) return '#f59e0b';
        if (estado >= 400) return '#ef4444';
        return '#22c55e';
    };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Auditoría - Últimas 100 peticiones a la API</h2>

            <button
                onClick={() => navigate('/admin')}
                style={{ color: 'white', backgroundColor: '#7c5cf0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
                Volver al panel
            </button>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #4b5563' }}>
                        <th>Fecha</th><th>Usuario</th><th>Método</th><th>Ruta</th><th>Estado</th><th>Tiempo</th><th>IP</th><th>Origen</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #374151' }}>
                            <td style={{ padding: '10px 0' }}>{new Date(r.createdAt).toLocaleString()}</td>
                            <td>{r.email || 'Sin loguear'}</td>
                            <td>{r.metodo}</td>
                            <td>{r.ruta}</td>
                            <td style={{ color: colorEstado(r.estado), fontWeight: '700' }}>{r.estado}</td>
                            <td>{r.duracionMs} ms</td>
                            <td>{r.ip}</td>
                            <td>{r.origen || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Audit;
