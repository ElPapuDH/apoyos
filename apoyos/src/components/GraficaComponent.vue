<template>
    <div>
      <canvas ref="chartRef" id="myChart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  export default {
    name: 'GraficaComponent',
    setup() {
      const chartRef = ref(null);
  
      const fetchGastos = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/gastos');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error('Error fetching gastos:', error);
          return [];
        }
      };
  
      const createChart = (gastos) => {
      if (!gastos || gastos.length === 0) {
          console.warn('No gastos data to display.');
          return;
      }
  
      const labels = [];
      const datasets = [];
  
      // Organizar datos por Sección y Mes
      gastos.forEach(({ Seccion, Total, Mes }) => {
          if (!labels.includes(Mes)) {
              labels.push(Mes);
          }
          
          // Generar un color aleatorio para cada Sección
          const backgroundColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
          const borderColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
  
          // Crear un dataset único para cada Sección
          datasets.push({
              label: `Sección ${Seccion} - ${Mes}`,
              data: Array(labels.length).fill(0).map((_, i) => (labels[i] === Mes ? Total : 0)),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
          });
      });
  
      const chartData = {
          labels: labels,
          datasets: datasets,
      };
  
      const ctx = chartRef.value.getContext('2d');
      new Chart(ctx, {
          type: 'bar',
          data: chartData,
          options: {
              responsive: true,
              scales: {
                  x: {
                      title: {
                          display: true,
                          text: 'Mes',
                      },
                  },
                  y: {
                      title: {
                          display: true,
                          text: 'Monto',
                      },
                  },
              },
              plugins: {
                  tooltip: {
                      callbacks: {
                          label: function(tooltipItem) {
                              return `Monto Gastado: ${tooltipItem.raw}`;
                          }
                      }
                  },
                  legend: {
                      position: 'top',
                  },
                  title: {
                      display: true,
                      text: 'Gastos por Sección y Mes',
                  },
              },
          },
      });
  };
  
  
      onMounted(async () => {
        const gastos = await fetchGastos();
        createChart(gastos);
      });
  
      return {
        chartRef,
      };
    },
  };
  </script>
  
  <style>
  canvas {
    max-width: 100%;
    height: 400px;
  }
  </style>