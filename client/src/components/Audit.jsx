import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Audit() {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [texto, setTexto] = useState('');
    const [metodo, setMetodo] = useState('');
    const [estado, setEstado] = useState('');

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

    const filtrados = registros.filter(r => {
        const usuarioYRuta = `${r.email || ''} ${r.ruta}`.toLowerCase();
        if (texto && !usuarioYRuta.includes(texto.toLowerCase())) return false;
        if (metodo && r.metodo !== metodo) return false;
        if (estado && r.estado !== Number(estado)) return false;
        return true;
    });

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Auditoría - Últimas 100 peticiones a la API</h2>

            <button
                onClick={() => navigate('/admin')}
                style={{ color: 'white', backgroundColor: '#7c5cf0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
                Volver al panel
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                <input
                    placeholder="Buscar por usuario o ruta"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    style={estiloFiltro}
                />
                <select value={metodo} onChange={(e) => setMetodo(e.target.value)} style={estiloFiltro}>
                    <option value="">Todos los métodos</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} style={estiloFiltro}>
                    <option value="">Todos los estados</option>
                    <option value="200">200 - OK</option>
                    <option value="201">201 - Creado</option>
                    <option value="304">304 - Sin cambios</option>
                    <option value="400">400 - Datos inválidos</option>
                    <option value="401">401 - Sin sesión</option>
                    <option value="403">403 - Sin permiso</option>
                    <option value="404">404 - No encontrado</option>
                    <option value="409">409 - Ya existe</option>
                    <option value="429">429 - Demasiadas peticiones</option>
                    <option value="500">500 - Error del servidor</option>
                </select>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '13px' }}>Mostrando {filtrados.length} de {registros.length}</p>

            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #4b5563' }}>
                        <th>Fecha</th><th>Usuario</th><th>Método</th><th>Ruta</th><th>Estado</th><th>Tiempo</th><th>IP</th><th>Origen</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map(r => (
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

const estiloFiltro = {
    backgroundColor: '#141229',
    color: 'white',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
};

export default Audit;
