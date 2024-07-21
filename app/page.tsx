'use client'
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { testMethod } from "@/server/actions/test";
import { useState, useEffect } from "react";
import { Face } from "./components/Face";

import VoiceSelector from "./VoiceSelector";
import Link from "next/link";
import { Instagram } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";



const synth = window.speechSynthesis;

const sampleText = "The quick brown fox jumps over the lazy dog near the tranquil riverbank at sunset."



export default function Home() {
  const [message, setMessage] = useState("");
  const [textValue, setTextValue] = useState({textValue:""});
  const [selectedVoice, setSelectedVoice] = useState<number>(0);

  const {execute, status} = useAction(testMethod, {
    onSuccess(data:any){
      console.log("HERE in success")
      console.log(data)
      if(data){
        setMessage(data.data)
      }
    }
  })

  if (!synth)
    return <span>Aw... your browser does not support Speech Synthesis</span>;


  const speak = (textValue:string) => {


    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textValue);
    utterance.voice = synth.getVoices()[selectedVoice];

    synth.speak(utterance);
  };


  useEffect(() => {
    if(message.length > 0){
      speak(message)
    }
  }, [message])

  function onsubmit(){
    execute(textValue);
  }



  return (
    <main className="">
      <div className="">
        <div className=" absolute h-screen z-50 w-24 flex justify-center ">
          <div className="mt-20 ">
            <div className="bg-slate-100 p-1.5 rounded-md cursor-pointer hover:scale-105">
              <Link href = "https://instagram.com" target="_blank">
                <Instagram color="#292929"/>
              </Link>
            </div>
          </div>
        </div>
        <div className="bottom-0 absolute z-50  w-screen mb-20 flex flex-col items-center ">
            {<span className="bg-gray-100  text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 w-max mb-3">{message}</span> }
            <div className="flex justify-center align-center w-full ">
              <input type="text" id="first_name" className="z-99 w-1/2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required value= {textValue.textValue} onChange={(e) => setTextValue({textValue:e.target.value})}/>
              <button className="bg-blue-500 rounded-lg p-3 ml-2 text-white" onClick={() => onsubmit()}>Send</button>
            </div>
            <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} />
        </div>
      </div>
      <div className="h-screen z-50 absolute  right-0 text-center">
        <Drawer>
          <DrawerTrigger className="">
            <Button variant={'outline'} size={'icon'} className="mr-2 mt-2">&lt;</Button>
          </DrawerTrigger>
          <DrawerContent className="bg-slate-100">
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>

          </DrawerContent>
        </Drawer>
      </div>
      <Face/>

    </main>
  );
}
