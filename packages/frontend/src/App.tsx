import { API } from 'aws-amplify'
import './App.css'
import { useEffect, useState } from 'react';
import { TypeInformationGermany } from '../../core/types/InformationGermany';
import { TypeCases } from '../../core/types/InformationCases';

function loadGermanyOverviewData(): Promise<TypeInformationGermany> {
  return API.get('covid-api', "/api/germany", {});
}

function loadGermanyCaseData(days: number = 100) {
  return API.get('covid-api', `/api/germany/cases/${days}`, {});
}

function App() {

  const [data, setdata] = useState<TypeInformationGermany | null>(null);
  const [caseData, setCaseData] = useState<TypeCases | null>(null);

  useEffect(() => {

    async function onLoad() {
      try {
        const notes = await loadGermanyOverviewData();
        const caseData = await loadGermanyCaseData();
        setdata(notes);
        setCaseData(caseData);
      } catch (e) {
        console.log(e);
      }
    }

    onLoad();

  }, [])


  return (
    <main className="h-full gap-2 p-4 pb-4 pl-18 pr-18 overflow-y-auto">
      <div className='bg-inherit w-full h-[100%] md:h-[50%] flex flex-col md:flex-row flex-wrap p-2'>
        <div className='h-full flex-1 flex flex-col max-w-[50%]'>
          <h1 className='text-2xl font-bold'>Covid-19 Statistics - Germany Today</h1>
          <div className='flex-1 w-full flex flex-row p-2 gap-4 items-center justify-around' >

            <div className="stats text-lg shadow h-32 lg:h-40 xl:h-46">
              <div className="stat bg-slate-700">
                <div className="stat-title">Total Number of Cases</div>
                <div className="stat-value">{data?.cases}</div>
                <div className="stat-desc text-sm">New Cases Today: {data?.delta.cases}</div>
              </div>
            </div>

            <div className="stats text-lg shadow h-32 lg:h-40 xl:h-46">
              <div className="stat bg-slate-700">
                <div className="stat-title">Total Number of Deaths</div>
                <div className="stat-value">{data?.deaths}</div>
                <div className="stat-desc text-sm">New Deaths Today: {data?.delta.deaths}</div>
              </div>
            </div>

            <div className="stats text-lg shadow h-32 lg:h-40 xl:h-46">
              <div className="stat bg-slate-700">
                <div className="stat-title">Week Incidence</div>
                <div className="stat-value">{data?.weekIncidence.toPrecision(2)}</div>
                <div className="stat-desc text-xs"> Yesterday:{data && data?.delta.weekIncidence > 0 ? '↗︎' : '↘︎'} {data?.delta.weekIncidence.toPrecision(2)}</div>
              </div>
            </div>

            <div className="stats text-lg shadow h-32 lg:h-40 xl:h-46">
              <div className="stat bg-slate-700">
                <div className="stat-title">Recovered</div>
                <div className="stat-value">{data?.recovered}</div>
                <div className="stat-desc text-sm">Recovered today: {data?.delta.recovered}</div>
              </div>
            </div>

          </div>

        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className='h-full flex-1'></div>
      </div>
      <div className='bg-inherit w-full h-[50%] p-2'>
        <div className='h-full flex-1'></div>
      </div>
    </main>
  )
}

export default App
