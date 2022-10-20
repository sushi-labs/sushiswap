/**
 * Apologies for this code. It's kind of hacked together to quickly demonstrate things.
 */
var version = 'v1.1.1';
var exampleWidth = 250;
var exampleHeight = 200;
var showMainExample = !window.location.search.includes('showMainExample=0');
var showPathValues = window.location.search.includes('showPathValues=1');
var optionShowPathPoints = window.location.search.includes('showPathPoints=1');
var maxNumLoops = 10; // comment out for infinite looping
// var activeExamples = [13]; // comment out for all examples
// var activeExamples = [2]; // comment out for all examples
var delayTime = 0; // 1000
var duration = 3000; // 2000

console.log('Show Main Example', showMainExample);
console.log('Show Path Values', showPathValues);

// helper to loop a path between two points
function loopPathBasic(path, dPath1, dPath2, loopForever) {
  var loopCount = 0;
  var looper = function () {
    if (!loopForever && typeof maxNumLoops !== 'undefined' && loopCount >= maxNumLoops) {
      return;
    } else {
      loopCount += 1;
    }

    path.attr('d', dPath1)
      .transition()
      .delay(delayTime)
      .duration(duration)
      .attr('d', dPath2)
      .transition()
      .delay(delayTime)
      .duration(duration)
      .attr('d', dPath1)
      .on('end', looper);
  };
  looper();
}

// helper to loop a path between two points using d3-interpolate-path
function loopPath(path, dPath1, dPath2, pathTextRoot, svg, excludeSegment, loopForever) {
  var loopCount = 0;
  var looper = function () {
    if (!loopForever && typeof maxNumLoops !== 'undefined' && loopCount >= maxNumLoops) {
      return;
    } else {
      loopCount += 1;
    }

    path.attr('d', dPath1)
      .transition()
      .delay(delayTime)
      .duration(duration)
      .attrTween('d', function () {
        return d3.interpolatePath(d3.select(this).attr('d'), dPath2, excludeSegment);
      })
      .on('start', function (a) {
        if (pathTextRoot) {
          // set timeout in case num points immediately after first tick changes
          setTimeout(function () { showPathPoints(svg, d3.transition().duration(duration)); }, 0);
          showDValues(pathTextRoot, dPath1, dPath2, this, d3.transition().duration(duration));
        }
      })
      .transition()
      .delay(delayTime)
      .duration(duration)
      .attrTween('d', function () {
        return d3.interpolatePath(d3.select(this).attr('d'), dPath1, excludeSegment);
      })
      .on('start', function (a) {
        if (pathTextRoot) {
          // set timeout in case num points immediately after first tick changes
          setTimeout(function () { showPathPoints(svg, d3.transition().duration(duration)); }, 0);
          showDValues(pathTextRoot, dPath1, dPath2, this, d3.transition().duration(duration), true);
        }
      })
      .on('end', looper);
  };
  looper();
}

function mainExample() {
  var dataLine1 = [[0, 0], [200, 100], [400, 50], [500, 80]];
  var dataLine2 = [[0, 100], [100, 50], [220, 80], [250, 0],
    [300, 20], [350, 30], [400, 100], [420, 10], [430, 90],
    [500, 40]];
  var data = dataLine1.concat(dataLine2);

  var width = 600;
  var height = 480;
  var lineHeight = 120;

  var x = d3.scaleLinear()
      .domain(d3.extent(data, function (d) { return d[0]; }))
      .range([0, width]);

  var y = d3
      .scaleLinear()
      .domain(d3.extent(data, function (d) { return d[1]; }))
      .range([lineHeight * 0.8, lineHeight * 0.5]);


  var svg = d3.select('.chart-container').append('svg')
      .attr('width', width)
      .attr('height', height)

  var line = d3.line()
      .curve(d3.curveLinear)
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return y(d[1]); });


  var g = svg.append('g');

  g.append('path')
    .datum(dataLine1)
    .attr('d', line);

  g.append('text')
    .attr('y', 25)
    .text('Line A');

  g = svg.append('g')
    .attr('transform', 'translate(0 ' + lineHeight + ')')
    .attr('class', 'using-d3-default');

  loopPathBasic(g.append('path'), line(dataLine1), line(dataLine2), true);

  g.append('text')
    .attr('y', 25)
    .text('d3 default interpolation');

  g = svg.append('g')
    .attr('transform', 'translate(0 ' + lineHeight * 2 + ')')

  loopPath(g.append('path'), line(dataLine1), line(dataLine2), null, null, null, true);

  g.append('text')
    .attr('y', 25)
    .text('d3-interpolate-path ' + version);

  g = svg.append('g')
    .attr('transform', 'translate(0 ' + lineHeight * 3 + ')')

  g.append('path')
    .datum(dataLine2)
    .attr('d', line);

  g.append('text')
    .attr('y', 25)
    .text('Line B');

}


var examples = [
  {
    name: 'cubic simple',
    a: 'M20,20 C160,90 90,120 100,160',
    b: 'M20,20 C60,90 90,120 150,130 C150,0 180,100 250,100',
    scale: false,
  },
  {
    name: 'quadratic simple',
    a: 'M0,70 Q160,20 200,100',
    b: 'M0,70 Q50,0 100,30 Q120,130 200,100',
  },
  {
    name: 'simple d3-area example',
    a: 'M0,42L300,129L300,200L0,200Z',
    b: 'M0,77L150,95L300,81L300,200L150,200L0,200Z',
    scale: false,
    className: 'filled',
    excludeSegment: function (a, b) { return a.x === b.x && a.x === 300; },
  },
  {
    name: 'bigger d3-area example',
    a: 'M0,100L33,118L67,66L100,154L133,105L167,115L200,62L233,115L267,88L300,103L300,200L267,200L233,200L200,200L167,200L133,200L100,200L67,200L33,200L0,200Z',
    b: 'M0,94L75,71L150,138L225,59L300,141L300,200L225,200L150,200L75,200L0,200Z',
    scale: false,
    className: 'filled',
    excludeSegment: function (a, b) { return a.x === b.x && a.x === 300; },
  },
  {
    name: 'shape example',
    a: 'M150,0 L280,100 L150,200 L20,100Z',
    b: 'M150,10 L230,30 L270,100 L230,170 L150,190 L70,170 L30,100 L70,30Z',
    scale: false,
    className: 'filled',
  },
  {
    name: 'simple vertical line test',
    a: 'M0,0 L300,200',
    b: 'M100,20 L150,80 L200,140 L300,200',
    scale: false,
  },
  {
    name: 'vertical line test',
    a: 'M150,0 L200,40 L100,60 L120,80 L50,100 L250,150 L120,200',
    b: 'M120,0 L100,30 L20,45 L220,60 L270,90 L180,95 L50,130 L85,140 L140,150 L190,175 L60,195',
    scale: false,
  },
  {
    name: 'curve test',
    a: 'M0,32.432432432432506L5.533333333333334,47.39382239382246C11.066666666666668,62.355212355212416,22.133333333333336,92.27799227799233,33.2,108.39768339768345C44.26666666666667,124.51737451737455,55.333333333333336,126.83397683397686,66.39999999999999,136.38996138996143C77.46666666666667,145.94594594594597,88.53333333333335,162.74131274131278,99.59999999999998,156.3706563706564C110.66666666666667,150.00000000000003,121.73333333333335,120.4633204633205,132.8,96.42857142857149C143.86666666666667,72.39382239382245,154.93333333333334,53.861003861003915,166,40.83011583011588C177.0666666666667,27.79922779922784,188.13333333333333,20.2702702702703,199.20000000000002,19.78764478764482C210.26666666666665,19.30501930501934,221.33333333333334,25.86872586872592,232.4,35.328185328185384C243.4666666666667,44.787644787644844,254.5333333333334,57.14285714285719,265.6,71.91119691119695C276.6666666666667,86.67953667953672,287.73333333333335,103.86100386100391,298.8,119.11196911196915C309.8666666666667,134.3629343629344,320.93333333333334,147.68339768339771,332,133.30115830115832C343.06666666666666,118.9189189189189,354.1333333333334,76.8339768339768,365.2,49.99999999999997C376.26666666666665,23.166023166023137,387.3333333333333,11.583011583011569,398.40000000000003,7.046332046332036C409.4666666666667,2.509652509652502,420.5333333333333,5.019305019305004,431.6000000000001,13.6100386100386C442.6666666666667,22.200772200772196,453.7333333333334,36.872586872586886,464.8,55.59845559845562C475.86666666666673,74.32432432432437,486.9333333333334,97.10424710424714,498,109.94208494208497C509.06666666666666,122.7799227799228,520.1333333333333,125.67567567567568,531.2,121.23552123552123C542.2666666666668,116.79536679536677,553.3333333333334,105.01930501930501,564.4,96.71814671814673C575.4666666666667,88.41698841698843,586.5333333333334,83.59073359073363,597.6,93.72586872586878C608.6666666666666,103.86100386100391,619.7333333333332,128.95752895752898,630.8,149.32432432432435C641.8666666666667,169.69111969111972,652.9333333333333,185.32818532818533,664,189.86486486486487C675.0666666666666,194.40154440154438,686.1333333333332,187.83783783783784,697.1999999999999,183.01158301158299C708.2666666666665,178.1853281853282,719.3333333333334,175.09652509652508,730.4,173.45559845559845C741.4666666666667,171.8146718146718,752.5333333333333,171.62162162162164,763.6,159.45945945945948C774.6666666666666,147.29729729729732,785.7333333333332,123.16602316602318,796.7999999999998,109.16988416988418C807.8666666666667,95.17374517374519,818.9333333333334,91.31274131274132,824.4666666666667,89.38223938223939L830,87.45173745173747',
    b: 'M0,55.22478736330493L2.194315928618639,59.325637910085C4.388631857237278,63.42648845686508,8.777263714474556,71.62818955042523,13.165895571711836,74.17982989064394C17.55452742894911,76.73147023086267,21.943159286186386,73.63304981773996,26.331791143423658,73.35965978128796C30.720423000660944,73.08626974483597,35.10905485789822,75.63791008505468,39.497686715135494,72.90400972053463C43.88631857237277,70.17010935601458,48.274950429610044,62.15066828675575,52.663582286847316,53.94896719319561C57.052214144084616,45.74726609963545,61.44084600132189,37.36330498177398,65.82947785855914,28.341433778857823C70.21810971579642,19.31956257594167,74.60674157303372,9.659781287970835,78.99537343027099,79.82989064398542C83.38400528750826,150,87.77263714474554,300,92.16126900198282,375C96.54990085922009,450,100.93853271645739,450,105.32716457369463,450C109.71579643093196,450,114.10442828816923,450,118.4930601454065,450C122.88169200264377,450,127.27032385988105,450,131.6589557171183,450C136.04758757435556,450,140.43621943159283,450,144.82485128883013,450C149.21348314606743,450,153.6021150033047,450,157.99074686054198,450C162.37937871777925,450,166.76801057501652,450,171.15664243225382,450C175.5452742894911,450,179.93390614672836,450,184.32253800396563,450C188.7111698612029,450,193.09980171844018,450,197.4884335756775,385.2065613608749C201.87706543291478,320.4131227217497,206.26569729015205,190.8262454434994,210.65432914738926,127.03523693803159C215.0429610046266,63.244228432563794,219.4315928618638,65.24908869987847,223.82022471910113,73.90643985419194C228.20885657633835,82.56379100850542,232.59748843357568,97.87363304981771,236.986120290813,109.35601458080191C241.37475214805022,120.83839611178614,245.76338400528755,128.4933171324423,250.15201586252476,126.03280680437426C254.5406477197621,123.57229647630619,258.9292795769993,110.99635479951398,263.3179114342366,97.32685297691371C267.7065432914739,83.65735115431347,272.0951751487112,68.89428918590521,276.48380700594845,61.512758201701075C280.8724388631857,54.13122721749693,285.261070720423,54.13122721749693,289.64970257766026,54.04009720534626C294.03833443489754,53.948967193195585,298.42696629213486,53.76670716889424,302.81559814937214,53.49331713244223C307.2042300066094,53.21992709599024,311.5928618638467,52.85540704738757,315.98149372108395,52.03523693803155C320.3701255783212,51.21506682867554,324.7587574355585,49.939246658566184,329.14738929279576,51.76184690157955C333.53602115003304,53.58444714459292,337.9246530072703,58.505467800729015,342.3132848645076,73.63304981773996C346.7019167217448,88.7606318347509,351.0905485789821,114.09477521263669,355.4791804362194,132.04738760631835C359.86781229345667,150,364.256444150694,160.57108140947753,368.64507600793127,162.30255164034023C373.03370786516854,164.03402187120292,377.42233972240575,156.9258809234508,381.8109715796431,149.81773997569866C386.19960343688035,142.70959902794652,390.5882352941176,135.6014580801944,394.97686715135495,128.58444714459293C399.3654990085922,121.56743620899147,403.7541308658295,114.64155528554068,408.1427627230668,103.52369380315913C412.5313945803041,92.40583232077762,416.9200264375413,77.09599027946535,421.3086582947787,80.92345078979342C425.6972901520159,84.7509113001215,430.0859220092531,107.7156743620899,434.4745538664904,131.318347509113C438.86318572372767,154.92102065613608,443.2518175809649,179.16160388821382,447.6404494382022,184.81166464155527C452.0290812954395,190.46172539489672,456.41771315267675,177.5212636695018,460.8063450099141,152.09599027946535C465.19497686715135,126.6707168894289,469.5836087243886,88.76063183475092,474.063670411985,67.61846901579587C478.5437320995814,46.476306196840824,483.1152236175369,42.102065613608715,487.5952853051333,42.92223572296473C492.0753469927297,43.74240583232074,496.46397884996696,49.75698663426488,500.8526107072042,66.88942891859053C505.24124256444156,84.02187120291619,509.6298744216788,112.27217496962335,514.0185062789161,127.49088699878496C518.4071381361533,142.70959902794655,522.7957699933908,144.8967193195626,527.184401850628,153.91859052247875C531.5730337078652,162.9404617253949,535.9616655651025,178.7970838396112,540.3502974223397,172.78250303766706C544.738929279577,166.76792223572292,549.1275611368143,138.88213851761842,553.5161929940515,116.19076549210202C557.9048248512887,93.49939246658563,562.2934567085262,76.00243013365734,566.6820885657634,63.69987849331713C571.0707204230007,51.397326852976924,575.4593522802379,44.289185905224805,579.8479841374752,43.83353584447147C584.2366159947125,43.377885783718135,588.6252478519497,49.57472660996357,593.013879709187,58.50546780072906C597.4025115664243,67.43620899149454,601.7911434236615,79.10085054678007,606.1797752808989,93.0437424058323C610.5684071381362,106.98663426488456,614.9570389953734,123.20777642770351,619.3456708526107,137.6063183475091C623.7343027098481,152.0048602673147,628.1229345670853,164.58080194410695,632.5115664243225,151.00243013365738C636.9001982815598,137.4240583232078,641.288830138797,97.6913730255164,645.6774619960344,72.3572296476306C650.0660938532716,47.023086269744816,654.454725710509,36.087484811664616,658.8433575677462,31.8043742405832C663.2319894249835,27.52126366950178,667.6206212822208,29.890643985419143,672.009253139458,38.00121506682863C676.3978849966953,46.11178614823812,680.7865168539325,59.96354799513974,685.17514871117,77.6427703523694C689.5637805684072,95.32199270959906,693.9524124256444,116.82867557715677,698.3410442828817,128.94896719319564C702.7296761401191,141.0692588092345,707.1183079973563,143.80315917375452,711.5069398545935,139.61117861482379C715.8955717118309,135.41919805589302,720.2842035690682,124.3013365735115,724.6728354263054,116.46415552855404C729.0614672835427,108.62697448359658,733.4500991407799,104.07047387606316,737.8387309980171,113.63912515188333C742.2273628552545,123.2077764277035,746.6159947124917,146.90157958687723,751.0046265697289,166.13001215066825C755.3932584269663,185.35844471445924,759.7818902842035,200.12150668286753,764.1705221414408,204.40461725394894C768.5591539986781,208.68772782503038,772.9477858559153,202.49088699878493,777.3364177131526,197.93438639125148C781.7250495703898,193.37788578371809,786.1136814276273,190.46172539489672,790.5023132848645,188.91251518833533C794.8909451421018,187.36330498177395,799.279576999339,187.18104495747264,803.6682088565764,175.69866342648842C808.0568407138136,164.21628189550424,812.4454725710508,141.43377885783715,816.8341044282882,128.21992709599024C821.2227362855255,115.00607533414336,825.6113681427627,111.36087484811662,827.8056840713813,109.53827460510325L830,107.71567436208989',
  },
  {
    name: 'line extends example',
    a: 'M0,81L13,128L27,84L40,83L53,114L67,114L80,137L93,116L107,95L120,57L133,87L147,93L160,163L173,95L187,123L200,113',
    b: 'M0,81L13,128L27,84L40,83L53,114L67,114L80,137L93,116L107,95L120,57L133,87L147,93L160,163L173,95L187,123L200,113L210,96L228,145L246,92L264,106L282,56L300,90',
    scale: false,
  },
  {
    name: 'graticule test',
    a: 'M325.1483457087596,531.4452502639945L340.7606028278758,399.7423780391654L359.3445610837574,268.6082938654016L380.395962152234,138.02316901947256L403.36162136396405,7.912231358580129',
    b: 'M354.49306197556837,528.5099972371023L344.61144068364655,289.8103838246071L333.8706761621328,30.357378766024',
  },
  {
    name: 'line to line: len(A) = len(b)',
    a: 'M0,0L10,10L100,100',
    b: 'M10,10L20,20L200,200',
  },
  {
    name: 'line to line: len(A) > len(b)',
    a: 'M0,0L10,10L100,100',
    b: 'M10,10L20,20',
  },
  {
    name: 'line to line: len(A) < len(b)',
    a: 'M0,0L10,10',
    b: 'M10,10L20,20L200,200',
  },
  {
    name: 'line to line: len(A)=1',
    a: 'M0,0Z',
    b: 'M10,10L20,20L200,200',
  },
  {
    name: 'line to line: len(B)=1',
    a: 'M0,0L10,10L100,100',
    b: 'M10,10Z',
  },
  {
    name: 'line to line: A is null',
    a: null,
    b: 'M10,10L20,20L200,200',
  },
  {
    name: 'line to line: B is null',
    a: 'M0,0L10,10L100,100',
    b: null,
  },
  {
    name: 'line to line: A is null and B is null',
    a: null,
    b: null,
  },
  {
    name: 'where both A and B end in Z',
    a: 'M0,0Z',
    b: 'M10,10L20,20Z',
  },
  {
    name: 'where A=null, B ends in Z',
    a: null,
    b: 'M10,10L20,20Z',
  },
  {
    name: 'with other valid `d` characters',
    a: 'M0,0m0,0L0,0l0,0H0V0Q0,0,0,0q0,0,0,0C0,0,0,0,0,0c0,0,0,0,0,0T0,0t0,0' +
      'S0,0,0,0s0,0,0,0A0,0,0,0,0,0,0',
    b: 'M4,4m4,4L4,4l4,4H4V4Q4,4,4,4q4,4,4,4C4,4,4,4,4,4c4,4,4,4,4,4T4,4t4,4' +
      'S4,4,4,4s4,4,4,4A4,4,0,0,0,4,4',
  },
  {
    name: 'converts points in A to match types in B',
    a: 'M2,2 L3,3          C4,4,4,4,4,4 C5,5,5,5,5,5  L6,6  L7,7',
    b: 'M4,4 C5,5,5,5,5,5  L6,6         S7,7,7,7      H8    V9',
  },
  {
    name: 'curves of different length',
    a: 'M0,0L3,3C1,1,2,2,4,4C3,3,4,4,6,6L8,0',
    b: 'M2,2L3,3C5,5,6,6,4,4C6,6,7,7,5,5C8,8,9,9,6,6C10,10,11,11,7,7L8,8',
  },
  {
    name: 'adds to the closest point',
    a: 'M0,0L4,0L20,0',
    b: 'M0,4L1,4L3,0L4,0L10,0L14,0L18,0',
  },
  {
    name: 'handles the case where path commands are followed by a space',
    a: 'M 0 0 L 10 10 L 100 100',
    b: 'M10,10L20,20',
  },
  {
    name: 'includes M when extending if it is the only item',
    a: 'M0,0',
    b: 'M10,10L20,20L30,30',
  },
  {
    name: 'handles negative numbers properly',
    a: 'M0,0L0,0',
    b: 'M-10,-10L20,20',
  },
];

function formatDString(str) {
  return (str || '').split(/(?=[MLCSTQAHV])/gi).join('<br>');
}

function showPathPoints(svg, transition) {
  if (!optionShowPathPoints) {
    return;
  }

  var path = svg.select('path');

  var points = path.attr('d').split(/[MLCSTQAHVZ\s]/gi)
    .filter(function (d) { return d; })
    .map(function (d) { return d.split(',').map(function (x) { return +x; }); });

  var binding = svg.selectAll('circle').data(points);

  var entering = binding.enter().append('circle')
    .attr('r', 5)
    .style('fill', '#b0b')
    .style('fill-opacity', 0.2)
    .style('stroke', '#b0b');

  binding = binding.merge(entering)
    .attr('cx', function (d) { return d[0]; })
    .attr('cy', function (d) { return d[1]; });

  if (transition) {
    binding.transition(transition)
      .tween('cx cy', function (d) {
        var node = d3.select(this), i = points.indexOf(d);
        return function (t) {
          var currPoints = path.attr('d').split(/[MLCSTQAHVZ\s]/gi)
            .filter(function (d) { return d; })
            .map(function (d) { return d.split(',').map(function (x) { return +x; }); });

          if (!currPoints[i]) {
            node.remove();
          } else {
            node.attr('cx', currPoints[i][0]);
            node.attr('cy', currPoints[i][1]);
          }
        };
      });
  }
}

function showDValues(root, dLine1, dLine2, pathNode, transition) {
  if (!showPathValues) {
    return;
  }

  root.select('.path-d-original').html(formatDString(dLine1));
  root.select('.path-d-end').html(formatDString(dLine2));
  // var current = root.select('.path-d').html(formatDString(dLine1));
  var currentD = d3.select(pathNode).attr('d');
  var current = root.select('.path-d').html(formatDString(currentD));

  if (transition) {
    var first = true;
    current.transition(transition)
      .tween('text', function () {
        var node = this, i = d3.interpolateString(dLine1, dLine2);
        return function (t) {

          if (first || (t > 0.05 && Math.floor(t * 100) % 10 === 0)) {
            first = false;
            // console.log(d3.select(pathNode).attr('d'), t);
          }
          node.innerHTML = formatDString(d3.select(pathNode).attr('d'));
        };
      });
  }
}

function pathStringToExtent(str) {
  var asNumbers = str.replace(/([A-Z])/gi, ' ')
    .replace(/\s+/g, ',')
    .replace(/,,/g, ',')
    .replace(/^,/, '')
    .split(',')
    .map(function (d) { return +d; })
    .filter(function (d) { return !isNaN(d); });
  return d3.extent(asNumbers);
}

function makeExample(d, useInterpolatePath) {
  var width = exampleWidth;
  var height = exampleHeight;
  var container = d3.select(this).append('div')
    .classed('example-container', true)
    .classed('using-d3-interpolate-path', useInterpolatePath)
    .classed('using-d3-default', !useInterpolatePath);

  // set the title
  container.append('h4').text(d.name);
  container.append('div').attr('class', 'interpolator-used')
    .text(useInterpolatePath ? ('d3-interpolate-path ' + version) : 'd3 default interpolation');

  // scale the paths to fit nicely in the box
  var extent = pathStringToExtent(d.a + ' ' + d.b);
  var scaleFactorWidth = Math.min(1, width / extent[1]);
  var scaleFactorHeight = Math.min(1, height / extent[1]);

  // add the SVG
  var svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  if (d.scale !== false) {
    svg.attr('transform', 'scale(' + scaleFactorWidth + ' ' + scaleFactorHeight + ')');
  } else {
    svg.attr('transform', 'scale(' + scaleFactorWidth + ')');
  }

  // adjust the stroke for the scale factor
  var strokeWidth = 1.5 / Math.min(scaleFactorWidth, scaleFactorHeight);

  var path = svg.append('path')
    .style('stroke-width', strokeWidth)
    .attr('class', d.className);


  // add in the Path text
  if (showPathValues) {
    var pathTextRoot = container.append('div');
    pathTextRoot.html(
        '<div class="path-d-string">' +
          '<b>Path A</b>' +
          '<div class="path-d-original"></div>' +
        '</div>' +
        '<div class="path-d-string">' +
          '<b>Current <code>d</code></b>' +
          '<div class="path-d"></div>' +
        '</div>' +
        '<div class="path-d-string">' +
          '<b>Path B</b>' +
          '<div class="path-d-end"></div>' +
        '</div>');
  }
  if (useInterpolatePath) {
    loopPath(path, d.a, d.b, pathTextRoot, svg, d.excludeSegment);
  } else {
    loopPathBasic(path, d.a, d.b);
  }
  showDValues(pathTextRoot, d.a, d.b, path.node());
  showPathPoints(svg);
}

var showExamples = examples.filter(function (d, i) {
  return typeof activeExamples === 'undefined' || activeExamples.includes(i);
});

// Initialize main example area
if (showMainExample) {
  mainExample();
}

// Initialize example grid
var root = d3.select('.examples');
var selection = root.selectAll('.example')
  .data(showExamples)
  .enter();

selection.append('div')
  .attr('class', 'example')
  // .style('width', exampleWidth + 'px')
  .each(function (d) {
    makeExample.call(this, d, true);
    makeExample.call(this, d, false);
  });

