import { API } from "aws-amplify";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { TypeInformationGermany } from "../../core/types/InformationGermany";
import { TypeCases, TypeStateCasesData } from "../../core/types/InformationCases";
import { StatsCard } from "./components/StatsCard";
import { AxisOptions, Chart } from "react-charts";
import { TypeDeaths } from "../../core/types/InformationDeaths";
import { TypeInformationState, states } from "../../core/types/InformationState";

function fetchGermanyOverviewData(): Promise<TypeInformationGermany> {
  return API.get("covid-api", "/api/germany", {});
}

function fetchStateOverviewData(state: string): Promise<TypeInformationState> {
  return API.get("covid-api", `/api/states/${state}`, {});
}

function fetchGermanyCaseData(days: number = 100): Promise<TypeCases> {
  return days === 0 ? API.get("covid-api", `/api/germany/cases`, {}) : API.get("covid-api", `/api/germany/cases/${days}`, {});
}

function fetchGermanyDeathData(days: number = 100): Promise<TypeDeaths> {
  return days === 0 ? API.get("covid-api", `/api/germany/deaths`, {}) : API.get("covid-api", `/api/germany/deaths/${days}`, {});
}



interface ITransformedData {
  value: number;
  date: Date;
}

type Series = {
  label: string;
  data: ITransformedData[];
};

function App() {
  // DATA
  const [informationGermany, setInformationGermany] =
    useState<TypeInformationGermany | null>(null);
  const [informationSelectedState, setInformationSelectedState] = useState<TypeInformationState | null>(null)
  const [germanyCaseData, setGermanyCaseData] = useState<ITransformedData[]>(
    []
  );
  const [germanyDeathData, setGermanyDeathData] = useState<ITransformedData[]>(
    []
  );

  // States
  const [showDeaths, setShowDeaths] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("HE");

  const loadAndTransformGermanyCaseData = async (days: number) => {
    const caseData = await fetchGermanyCaseData(days);

    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    const transformedCaseData = caseData.data
      .map((value) => {
        return { value: value.cases, date: new Date(value.date) };
      })
      .filter((dataPoint) => {
        return ![0, 6].includes(dataPoint.date.getDay());
      });
    setGermanyCaseData(transformedCaseData);

  }

  const loadAndTransformGermanyDeathData = async (days: number) => {
    const deathData = await fetchGermanyDeathData(days);

    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    const transformedDeathData = deathData.data
      .map((value) => {
        return { value: value.deaths, date: new Date(value.date) };
      })
      .filter((dataPoint) => {
        return ![0, 6].includes(dataPoint.date.getDay());
      });
    setGermanyDeathData(transformedDeathData);

  }

  const timePeriodChangeGermany = (e: any) => {
    console.log(e.target.value);
    switch (e.target.value) {
      case "Last 100 days":
        loadAndTransformGermanyCaseData(100)
        loadAndTransformGermanyDeathData(100)
        break;
      case "Last Year":
        loadAndTransformGermanyCaseData(365)
        loadAndTransformGermanyDeathData(365)
        break;

      case "Complete History":
        loadAndTransformGermanyCaseData(0)
        loadAndTransformGermanyDeathData(0)
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    async function onLoad() {
      try {
        const germanyData = await fetchGermanyOverviewData();
        setInformationGermany(germanyData);

        const stateData = await fetchStateOverviewData(selectedState);
        console.log(stateData);
        setInformationSelectedState(stateData);


        loadAndTransformGermanyCaseData(100);
        loadAndTransformGermanyDeathData(100)

      } catch (e) {
        console.log(e);
      }
    }

    onLoad();
  }, []);

  useEffect(() => {

    async function loadStateData() {
      const stateData = await fetchStateOverviewData(selectedState);
      setInformationSelectedState(stateData);
    }

    loadStateData()


  }, [selectedState])


  const primaryAxis = useMemo(
    (): AxisOptions<ITransformedData> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ITransformedData>[] => [
      {
        getValue: (datum) => datum.value,
      },
    ],
    []
  );

  const data: Series[] = [
    {
      label: "React Charts",
      data: germanyCaseData,
    },
  ];

  return (
    <main className="h-full gap-2 p-4 pb-4 pl-18 pr-18 overflow-y-auto min-h-[40rem]">
      {/* 
      UPPER PART

       */}
      <div className="bg-inherit w-full h-[100%] md:h-[50%] flex flex-col md:flex-row flex-wrap p-2">
        <div className="h-full flex-1 flex flex-col max-w-[100%] md:max-w-[50%]">
          <h1 className="text-2xl font-bold">
            Covid-19 Statistics - Germany Today
          </h1>
          <div className="flex-1 w-full max-h-full flex items-center flex-row flex-wrap p-2 gap-4 overflow-y-auto">
            <StatsCard
              value={informationGermany?.cases}
              title="Total Number of Cases"
              desc={`New Cases Today: ${informationGermany?.delta.cases}`}
            ></StatsCard>
            <StatsCard
              value={informationGermany?.deaths}
              title="Total Number of Deaths"
              desc={`New Deaths Today: ${informationGermany?.delta.deaths}`}
            ></StatsCard>
            <StatsCard
              value={
                informationGermany
                  ? parseInt(informationGermany?.weekIncidence.toPrecision(2))
                  : 0
              }
              title="Week Incidence"
              desc={`Yesterday: ${informationGermany &&
                informationGermany?.delta.weekIncidence > 0
                ? "↗︎"
                : "↘︎"
                } ${informationGermany?.delta.weekIncidence.toPrecision(2)}`}
            ></StatsCard>
            <StatsCard
              value={informationGermany?.recovered}
              title="Recovered"
              desc={`Recovered today: ${informationGermany?.delta.recovered}`}
            ></StatsCard>
          </div>
        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="h-full flex-1 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Cases and Deaths - Germany</h1>
            <div className="join">
              <button className={`btn join-item btn-sm ${!showDeaths && "btn-info"}`} onClick={() => setShowDeaths(false)}>Cases</button>
              <button className={`btn join-item btn-sm ${showDeaths && "btn-info"}`} onClick={() => setShowDeaths(true)}>Deaths</button>

            </div>
            <select
              defaultValue="Last 100 days"
              onChange={(e) => timePeriodChangeGermany(e)}
              className="select select-xs select-info w-full max-w-xs"
            >
              <option>Last 100 days</option>
              <option>Last Year</option>
              <option>Complete History</option>
            </select>
          </div>
          <div className="flex-1 m-2">
            {germanyCaseData.length > 0 ? (
              <Chart
                options={{
                  data: [{
                    label: "React Charts",
                    data: showDeaths ? germanyDeathData : germanyCaseData,
                  }],
                  primaryAxis,
                  secondaryAxes,
                  dark: true,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      {/* 
      LOWER PART

       */}
      <div className="bg-inherit w-full h-[100%] md:h-[50%] flex flex-col md:flex-row flex-wrap p-2">
        <div className="h-full flex-1 flex flex-col max-w-[100%] md:max-w-[50%]">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">
              {`Covid-19 Statistics - State ${selectedState} Today`}
            </h1>
            <select
              defaultValue={states[0]}
              onChange={(e) => setSelectedState(e.target.value)}
              className="select select-sm select-info w-full max-w-xs"
            >
              {states.map((state) => {
                return (<option>{state}</option>)
              })}
            </select>
          </div>

          <div className="flex-1 w-full max-h-full flex items-center flex-row flex-wrap p-2 gap-4 overflow-y-auto">
            <StatsCard
              value={informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.cases}
              title="Total Number of Cases"
              desc={`New Cases Today: ${informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.delta.cases}`}
            ></StatsCard>
            <StatsCard
              value={informationGermany?.deaths}
              title="Total Number of Deaths"
              desc={`New Deaths Today: ${informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.delta.deaths}`}
            ></StatsCard>
            <StatsCard
              value={
                informationSelectedState?.data[selectedState as keyof TypeStateCasesData]
                  ? parseInt(informationSelectedState!.data[selectedState as keyof TypeStateCasesData]!.weekIncidence.toPrecision(2))
                  : 0
              }
              title="Week Incidence"
              desc={`Yesterday: ${informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.delta &&
                informationSelectedState!.data[selectedState as keyof TypeStateCasesData]!.delta.weekIncidence > 0
                ? "↗︎"
                : "↘︎"
                } `}
            ></StatsCard>
            <StatsCard
              value={informationSelectedState!.data[selectedState as keyof TypeStateCasesData]?.recovered}
              title="Recovered"
              desc={`Recovered today: ${informationSelectedState!.data[selectedState as keyof TypeStateCasesData]?.delta.recovered}`}
            ></StatsCard>
          </div>
        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="h-full flex-1 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Cases and Deaths - Germany</h1>
            <div className="join">
              <button className={`btn join-item btn-sm ${!showDeaths && "btn-info"}`} onClick={() => setShowDeaths(false)}>Cases</button>
              <button className={`btn join-item btn-sm ${showDeaths && "btn-info"}`} onClick={() => setShowDeaths(true)}>Deaths</button>

            </div>
            <select
              defaultValue="Last 100 days"
              onChange={(e) => timePeriodChangeGermany(e)}
              className="select select-xs select-info w-full max-w-xs"
            >
              <option>Last 100 days</option>
              <option>Last Year</option>
              <option>Complete History</option>
            </select>
          </div>
          <div className="flex-1 m-2">
            {germanyCaseData.length > 0 ? (
              <Chart
                options={{
                  data: [{
                    label: "React Charts",
                    data: showDeaths ? germanyDeathData : germanyCaseData,
                  }],
                  primaryAxis,
                  secondaryAxes,
                  dark: true,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
