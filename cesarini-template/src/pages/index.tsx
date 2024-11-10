import axios from "axios";
import { Link } from "@nextui-org/link";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Divider } from "@nextui-org/divider";
import { Slider } from "@nextui-org/slider";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { url } from "@/config/url";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [historicAvg, updateHistoricAvg] = useState("loading");

  const [question, updateQuestion] = useState("");

  useEffect(() => {
    axios.get("http://ip-api.com/json/").then((response) => {
      axios
        .post(
          url,
          { latitude: response.data.lat, longitude: response.data.lon },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Backend Response:", response.data);
          updateHistoricAvg(response.data);
        });
    });

    axios.get(url + "/crowdsource_question").then((response) => {
      console.log("crowdsource Response:", response.data);
      updateQuestion(response.data);
    });
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="text-lg	pb-4">Understandable Meteorology.</div>

          <div className="py-6">
            <span className="text-5xl">{historicAvg.emojis}</span>
            <br />
            <span className="text-xl">{historicAvg.advice}</span>
          </div>

          <span className={title({ color: "violet" })}>Feels Like:&nbsp;</span>
          {historicAvg !== "loading" ? (
            <span className={title()}>
              {/* {typeof historicAvg === "string" ? (
                <p>{historicAvg}°F</p> ) : (
                  
                  <p>loading...</p>)} */}
              {(historicAvg.temp_today * 1.8 + 32).toFixed(0)} °F
            </span>
          ) : (
            <Spinner color="secondary" />
          )}

          <div className="pt-5">
            <Tabs aria-label="Options" color="primary" radius="full">
              <Tab key="Basic" title="Basic">
                <Card>
                  <CardBody>
                    <Popover showArrow placement="bottom">
                      <PopoverTrigger>
                        <div className="text-3xl py-5 font-semibold text-violet-700 flex flex-col items-center">
                          <span className={title({ color: "yellow" })}>
                            Z-Score:&nbsp; {historicAvg.z_score?.toFixed(2)}
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-3">
                        z-score is a measure of how extreme today&apos;s weather
                        is compared to the same day in history. Generally more
                        than 2 is pretty extreme
                      </PopoverContent>
                    </Popover>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="Advanced" title="Advanced">
                <Card>
                  <CardBody>
                    <div className="flex flex-row whitespace-pre gap-2 p-6">
                      <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                          <p className="text-2xl">
                            μ: {historicAvg.population_mean?.toFixed(3)}{" "}
                          </p>
                        </PopoverTrigger>
                        <PopoverContent>population mean</PopoverContent>
                      </Popover>

                      <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                          <p className="text-2xl">
                            σ: {historicAvg.std_dev?.toFixed(3)}{" "}
                          </p>
                        </PopoverTrigger>
                        <PopoverContent>standard deviation</PopoverContent>
                      </Popover>

                      <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                          <p className="text-2xl">
                            🌡️: {historicAvg.temp_today}{" "}
                          </p>
                        </PopoverTrigger>
                        <PopoverContent>current temperature</PopoverContent>
                      </Popover>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>

        <Card className="min-w-[350px]">
          <CardBody className="py-4 text-red-700">
            <p>Users report more rain than is being reported</p>
          </CardBody>
        </Card>

        <Card className="min-w-[350px]">
          <CardHeader className="flex gap-3">
            {/* <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            /> */}
            <div className="flex flex-col">
              <p className="text-md">Hyperlocal 🗺️</p>
              <p className="text-small text-default-500">
                help others out with info!
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-4">
            <p>{question.question}</p>
          </CardBody>
          <Divider />
          <CardFooter>
            {question.type === "rain" && (
              <ButtonGroup>
                <Button>No</Button>
                <Button>Yes</Button>
              </ButtonGroup>
            )}
            {question.type === "snow" && (
              <>
                <Slider
                  size="sm"
                  step={1}
                  color="foreground"
                  label="Temperature"
                  showSteps={true}
                  maxValue={12}
                  minValue={0}
                  defaultValue={0}
                  className="max-w-md pr-2"
                />
                <Button color="primary">Button</Button>
              </>
            )}
            {question.type === "wind" && (
              <ButtonGroup>
                <Button>Less</Button>
                <Button>Same</Button>
                <Button>More</Button>
              </ButtonGroup>
            )}
            {question.type === "temp" && (
              <ButtonGroup>
                <Button>Colder</Button>
                <Button>Same</Button>
                <Button>Hotter</Button>
              </ButtonGroup>
            )}
          </CardFooter>
        </Card>

        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start min-w-[350px]">
            <small className="text-default-500">Nov 10, &apos;24</small>
            <h4 className="font-bold text-large">Future Weather Radar</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2 flex flex-row justify-center">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="https://s1.gifyu.com/images/SycS3.gif"
              unoptimized={true}
              width={350}
            />
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
