import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY
const VIRUSTOTAL_API_URI = process.env.VIRUSTOTAL_API_URI

const headers = {
    "accept": "application/json",
    "content-type": "application/x-www-form-urlencoded",
    "x-apikey": VIRUSTOTAL_API_KEY
}

export const urlScanner = async (uri) => {
  const r = await axios.post(VIRUSTOTAL_API_URI, { url: uri }, { headers: headers })

  // console.log(r)
  return r
}

export const urlInfo = async (ids) => {
  const r = await axios.get(`${VIRUSTOTAL_API_URI}/${ids}`, { headers: headers })

  // console.log(r)
  return r
}