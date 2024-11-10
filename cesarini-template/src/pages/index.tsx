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
          
          <span className={title()}><span className="no-wrap">Saturday,  Nov 9</span> </span>
          <br />
          <br />
          
          <span className={title()}>11:45 AM</span>
          <br />
          <br />
          
          <span className={title({ color: "violet" })}>Feels Like:&nbsp;</span>
          <br />
          <br />
          {historicAvg !== "loading" ? (
            <span className={title()}>
              {/* {typeof historicAvg === "string" ? (
                <p>{historicAvg}°F</p> ) : (
                  
                  <p>loading...</p>)} */}
              
              {historicAvg}°F
          </span>) : (<Spinner color="secondary"/>)}
          
          <br />
          <br />
          
          <span className={title()}>
          Clear
          </span>
          
      </div>
        
        {/* <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({color: "cyan"})}>Make&nbsp;</span>
          <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
          <br />
          <span className={title()}>
            websites regardless of your design experience.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
          The most accurate weather you could ask for.
          </div>
        </div> */}

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
