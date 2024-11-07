import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useAppContext } from '../../context/AppContext';
import { es } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        displayFormats: {
          day: 'dd/MM/yyyy'
        }
      },
      adapters: {
        date: {
          locale: es
        }
      },
      title: {
        display: true,
        text: 'Fecha'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Precio (€/L)'
      },
      min: undefined,
      max: undefined
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  }
};

export default function PriceChart() {
  const { state } = useAppContext();

  const getDatasetsByProvider = () => {
    const providerDatasets = new Map();
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

    state.proveedores?.forEach((proveedor, index) => {
      const cotizaciones = state.cotizaciones
        ?.filter(c => c.proveedorId === proveedor.id)
        .sort((a, b) => new Date(a.fechaSuministro).getTime() - new Date(b.fechaSuministro).getTime());

      if (cotizaciones?.length) {
        providerDatasets.set(proveedor.id, {
          label: proveedor.nombre,
          data: cotizaciones.map(c => ({
            x: new Date(c.fechaSuministro),
            y: c.precioLitro
          })),
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          tension: 0.4
        });
      }
    });

    return Array.from(providerDatasets.values());
  };

  const data = {
    datasets: getDatasetsByProvider()
  };

  return <Line options={options} data={data} />;
}