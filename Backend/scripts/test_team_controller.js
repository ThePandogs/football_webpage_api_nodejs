import teamController from '../src/controllers/teamController.js';

const mockReq = { query: {} };
const mockRes = {
  json: (d) => console.log('res.json:', d),
  status: function(s){ this._status = s; return this; }
};

(async () => {
  await teamController.selectTeams(mockReq, mockRes);
})();