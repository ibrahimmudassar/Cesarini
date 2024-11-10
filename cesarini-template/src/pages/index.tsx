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
import moment from "moment"

export default function IndexPage() {
  
  const [historicAvg, updateHistoricAvg] = useState("loading");
  const [z_score, updateZScore] = useState("loading");
  const [emojis, updateEmojis] = useState("loading");
  const [poetry, updatePoetry] = useState("loading");
  const day = moment().format('LL');
  const time = moment().format('LT');

  useEffect(() => {
    
    axios.get("http://ip-api.com/json/").then((response) => {
      axios.post(url, {latitude: response.data.lat, longitude: response.data.lon}, {headers: {
        'Content-Type': 'application/json'
      }}).then((response) => {
        console.log("Backend Response:", response.data);
        updateHistoricAvg(response.data.temp_today);
        updateZScore(response.data.z_score);
        updateEmojis(response.data.emojis);
        updatePoetry(response.data.poetry);
      })
    })
    
  },[])
  
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
          
          <span className={title({ color: "violet" })}>Feels Like:&nbsp;</span>
          <br />
          <br />
          {historicAvg !== "loading" ? (<span className={title()}>
              
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

          
      </div>

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
