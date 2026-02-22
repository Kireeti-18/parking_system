import axios from 'axios';

export function createParkingApi(data: object) {
  try {
    return axios.post(`/api/parking`, data);
  } catch (e) {
    return e;
  }
}

export function getParkingInfoApi(data: object) {
  try {
    return axios.get(`/api/parking/depart`, data);
  } catch (e) {
    return e;
  }
}

export const CreateParkingApi = createParkingApi;
export const GetParkingInfoAction = getParkingInfoApi;
