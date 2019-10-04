const TaiwanMap = new Vue({
  el: '#app',
  data: {
    h1: '縣市中文',
    h2: '縣市英文'
  },
  methods: {
    async getTaiwanMap() {
      var width = (this.$refs.map.offsetWidth).toFixed(),
          height = (this.$refs.map.offsetHeight).toFixed();

      // 判斷螢幕寬度，給不同放大值
      let mercatorScale;
      if(window.screen.width > 1366) {
        mercatorScale = 11000;
      }
      else if(window.screen.width <= 1366 && window.screen.width > 480) {
        mercatorScale = 9000;
      }
      else {
        mercatorScale = 6000;
      }

      // d3：svg path 產生器
      var path = await d3.geo.path().projection(
        // !important 座標變換函式
        d3.geo
          .mercator()
          .center([121,24])
          .scale(mercatorScale)
          .translate([width/2, height/2.5])
      );

      var svg = await d3.select('#svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet');

      var url = 'dist/taiwan.geojson';
      await d3.json(url, (error, topology) => {
        if (error) throw error;

        svg
          .selectAll('path')
          .data(topology.features)
          .enter().append('path')
          .attr('d', path)
          .attr({
            fill: '#000',
            id: (d) => 'city' + d.properties.COUNTYCODE,
            ch: (d) => d.properties.COUNTYNAME,
            en: (d) => d.properties.COUNTYENG
          })
          .on('click', d => {
            this.h1 = d.properties.COUNTYNAME;
            this.h2 = d.properties.COUNTYENG;
            if(document.querySelector('.active')) {
              document.querySelector('.active').classList.remove('active');
            }
            document.getElementById('city' + d.properties.COUNTYCODE).classList.add('active');
          });
      });
      return svg;
    }
  },
  mounted() {

    this.getTaiwanMap();

  }
})