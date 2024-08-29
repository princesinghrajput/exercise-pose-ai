export const referencePoses = [
  [
    {
      y: 124.59753513336182,
      x: 327.04432487487793,
      score: 0.8056554794311523,
      name: "nose",
    },
    {
      y: 113.11692237854004,
      x: 339.58802223205566,
      score: 0.8497990965843201,
      name: "left_eye",
    },
    {
      y: 115.08293867111206,
      x: 313.09120178222656,
      score: 0.7612839937210083,
      name: "right_eye",
    },
    {
      y: 119.14408206939697,
      x: 360.1692771911621,
      score: 0.8758992552757263,
      name: "left_ear",
    },
    {
      y: 123.60846519470215,
      x: 293.4404516220093,
      score: 0.8960071206092834,
      name: "right_ear",
    },
    {
      y: 159.33221340179443,
      x: 405.20689964294434,
      score: 0.8086122274398804,
      name: "left_shoulder",
    },
    {
      y: 158.59358310699463,
      x: 251.71576499938965,
      score: 0.7997316718101501,
      name: "right_shoulder",
    },
    {
      y: 176.3288927078247,
      x: 530.2150344848633,
      score: 0.418415367603302,
      name: "left_elbow",
    },
    {
      y: 168.38260173797607,
      x: 174.1352653503418,
      score: 0.23763853311538696,
      name: "right_elbow",
    },
    {
      y: 139.31010246276855,
      x: 538.322172164917,
      score: 0.5838156938552856,
      name: "left_wrist",
    },
    {
      y: 134.193377494812,
      x: 100.72532534599304,
      score: 0.6469255089759827,
      name: "right_wrist",
    },
    {
      y: 247.78281211853027,
      x: 369.6545696258545,
      score: 0.721747696399688,
      name: "left_hip",
    },
    {
      y: 249.13556098937988,
      x: 275.7068872451782,
      score: 0.651678204536438,
      name: "right_hip",
    },
    {
      y: 356.9084930419922,
      x: 385.54311752319336,
      score: 0.8475208282470703,
      name: "left_knee",
    },
    {
      y: 357.68543243408203,
      x: 275.2856731414795,
      score: 0.9515160322189331,
      name: "right_knee",
    },
    {
      y: 427.7648735046387,
      x: 395.1200771331787,
      score: 0.9469923973083496,
      name: "left_ankle",
    },
    {
      y: 429.17919158935547,
      x: 263.371000289917,
      score: 0.9694096446037292,
      name: "right_ankle",
    },
  ],
  [
    {
      y: 132.96160697937012,
      x: 375.5392646789551,
      score: 0.8219730854034424,
      name: "nose",
    },
    {
      y: 122.05198287963867,
      x: 390.4567241668701,
      score: 0.8474560379981995,
      name: "left_eye",
    },
    {
      y: 122.53078937530518,
      x: 358.1214141845703,
      score: 0.7523564696311951,
      name: "right_eye",
    },
    {
      y: 129.88516330718994,
      x: 409.1116237640381,
      score: 0.739482581615448,
      name: "left_ear",
    },
    {
      y: 131.74302577972412,
      x: 335.0589370727539,
      score: 0.7290408611297607,
      name: "right_ear",
    },
    {
      y: 162.8107452392578,
      x: 440.5068302154541,
      score: 0.696513831615448,
      name: "left_shoulder",
    },
    {
      y: 165.6049346923828,
      x: 305.8575487136841,
      score: 0.6938323974609375,
      name: "right_shoulder",
    },
    {
      y: 94.6327257156372,
      x: 469.78854179382324,
      score: 0.8640343546867371,
      name: "left_elbow",
    },
    {
      y: 91.2143325805664,
      x: 269.7936677932739,
      score: 0.7642057538032532,
      name: "right_elbow",
    },
    {
      y: 36.10493302345276,
      x: 450.86859703063965,
      score: 0.7959107160568237,
      name: "left_wrist",
    },
    {
      y: 34.31992292404175,
      x: 270.74817657470703,
      score: 0.6447569727897644,
      name: "right_wrist",
    },
    {
      y: 264.5068645477295,
      x: 422.0380401611328,
      score: 0.583245038986206,
      name: "left_hip",
    },
    {
      y: 254.04579162597656,
      x: 320.14671325683594,
      score: 0.8395577073097229,
      name: "right_hip",
    },
    {
      y: 359.55079078674316,
      x: 436.4803123474121,
      score: 0.6691692471504211,
      name: "left_knee",
    },
    {
      y: 361.5325927734375,
      x: 315.67848205566406,
      score: 0.8953436613082886,
      name: "right_knee",
    },
    {
      y: 428.71707916259766,
      x: 443.51027488708496,
      score: 0.9245302677154541,
      name: "left_ankle",
    },
    {
      y: 428.28346252441406,
      x: 302.68255710601807,
      score: 0.8952423334121704,
      name: "right_ankle",
    },
  ],
  // Add more reference poses if needed
];

export const getReferencePose = (step) => referencePoses[step] || null;