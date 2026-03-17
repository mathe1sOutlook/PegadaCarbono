import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Calculator from './pages/Calculator';
import EmissionFactors from './pages/EmissionFactors';
import LifeCycle from './pages/LifeCycle';
import TransportCalc from './pages/TransportCalc';
import StructureCalc from './pages/StructureCalc';
import TechnicalRef from './pages/TechnicalRef';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Calculator />} />
          <Route path="estrutura" element={<StructureCalc />} />
          <Route path="transporte" element={<TransportCalc />} />
          <Route path="fatores" element={<EmissionFactors />} />
          <Route path="ciclo-vida" element={<LifeCycle />} />
          <Route path="referencia" element={<TechnicalRef />} />
          <Route path="sobre" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
