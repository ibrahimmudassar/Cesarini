import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "@/config/url";
import { Spinner } from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import moment from "moment"

export default function IndexPage() {
  
  const [historicAvg, updateHistoricAvg] = useState("loading");
  const [z_score, updateZScore] = useState("loading");
  const [emojis, updateEmojis] = useState("loading");
  const [poetry, updatePoetry] = useState("loading");
  const day = moment().format('LL');
  const time = moment().format('LT');

  // useEffect(() => {
    
  //   axios.get("http://ip-api.com/json/").then((response) => {
  //     axios.post(url, {latitude: response.data.lat, longitude: response.data.lon}, {headers: {
  //       'Content-Type': 'application/json'
  //     }}).then((response) => {
  //       updateHistoricAvg(response.data.temp_today);
  //       updateZScore(response.data.z_score);
  //     })
  //   })
    
  // },[])


      function getLocationAPI(){
          
        let locData = {lat: null, lon: null};
        
        axios.get("http://ip-api.com/json/").then((response) => {
          
          locData = {lat: response.data.lat, lon: response.data.lon};
          
        })

        return locData;
    }


    function getLocation() {
      if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  (position) => {
                      return { lat: position.coords.latitude, lon: position.coords.longitude };
          });
          } else {
              console.log("Geolocation is not supported by this browser");
              let tempData = getLocationAPI();

              if (tempData){
                return {lat: tempData.lat, lon: tempData.lon};
              }
              else{
                return {};
              }

              
              
              
          }
      
    }

    useEffect(() => {

            let locData = getLocation();
            if (locData) {
                axios.post(
                    url,
                    { latitude: locData.lat, longitude: locData.lon },
                    { headers: { 'Content-Type': 'application/json' } }
                ).then((response) => {
                  updateHistoricAvg(response.data.temp_today);
                  updateZScore(response.data.z_score);
        updateEmojis(response.data.emojis);
        updatePoetry(response.data.poetry);
                })
                
            }
        
    }, []);


  const [showButtons, setShowButtons] = useState(true);

  // Function to handle button click
  const handleButtonClick = () => {
    setShowButtons(false);
  };

  const [question, updateQuestion] = useState("");
  const [type, updateType] = useState("Click me");

  async function questionGetter(){
    let response = await axios.get(url+"/crowdsource_question");
    
    if(response){
      updateQuestion(response.data.question);
      updateType(response.data.type);
    }
    
  }
  
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
          
      <div className={subtitle({ class: "mt-4" })}>
            The most accurate weather you could ask for.
      </div>
          
          <span className={title()}><span className="no-wrap">{day}</span> </span>
          <br />
          <br />
          
          <span style={{ color: 'gray' }}>{time}</span>
          
          <br />
          <br />
          
          <span className={title({ color: "violet"})}>Feels Like:&nbsp;</span>
          <br />
          <br />
          {historicAvg !== "loading" ? (<span className={title()}>
              
              {/* {typeof historicAvg === "string" ? (
                <p>{historicAvg}°F</p> ) : (
                  
                  <p>loading...</p>)} */}
              
              {historicAvg}°C
          </span>) : (<Spinner color="secondary"/>)}
          
          <br />
          <br />
          
          <span className={title()}>{emojis}</span>

          <br />
          <br />

          <span>{poetry}</span>

          <br />
          <br />
          <span className={title()}>Z-Score: </span>

          {z_score !== "loading" ? (
            <span className={title()}>
              {parseFloat(z_score).toFixed(2)}
            </span>
          ) : (
            <Spinner color="secondary" />
          )}

          
          <br />
          <br />
      </div>
        
       <div className={subtitle({ class: "flex flex-col items-center justify-center gap-2 py-8 md:py-10" })}>
            Despite what we're showing you, how do you actually feel the weather is like?
        </div>
      
      <div>
          
          <>
          
          <Button radius="full" className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg m-2" onClick={handleButtonClick}>
            Colder
          </Button>          

          <Button radius="full" className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg m-2" onClick={handleButtonClick}>
            About the Same
          </Button>          

          <Button radius="full" className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg m-2" onClick={handleButtonClick}>
            Hotter
          </Button>

          </>
            
      </div>

      <Button onClick={questionGetter} className="hidden onclick">
        {type}
      </Button>

        
      </section>
    </DefaultLayout>
  );
}
