
import "./Login.css"
import Welcome from "../../components/wellcome/wellcome";
import { useEffect } from "react";
export default function WellCome() {
  //// vefificar se o Login e senha ja foi configurado 
  useEffect(() => {
    fetchData()
  })

  async function fetchData() {
    try {

    } catch (error) {

    }
  }
  return (
    <div className="loginContainer">
      <Welcome />
    </div>
  )
}