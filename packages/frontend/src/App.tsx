import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { TypeInformationGermany } from "../../core/types/InformationGermany";
import { TypeStateCasesData } from "../../core/types/InformationCases";
import { StatsCard } from "./components/StatsCard";
import { AxisOptions, Chart } from "react-charts";
import { TypeStateDeathsData } from "../../core/types/InformationDeaths";
import { TypeInformationState, states } from "../../core/types/InformationState";
import { fetchGermanyCaseData, fetchGermanyDeathData, fetchGermanyOverviewData, fetchStateCaseData, fetchStateDeathData, fetchStateOverviewData } from "./api/calls";

interface ITransformedData {
  value: number;
  date: Date;
}

type SelectableTimePeriods = "Last 100 days" | "Last Year" | "Complete History";

function App() {
  // Data
  const [informationGermany, setInformationGermany] = useState<TypeInformationGermany | null>(null);
  const [informationSelectedState, setInformationSelectedState] = useState<TypeInformationState | null>(null)
  const [germanyCaseData, setGermanyCaseData] = useState<ITransformedData[]>([]);
  const [germanyDeathData, setGermanyDeathData] = useState<ITransformedData[]>([]);
  const [selectedStateCaseData, setSelectedStateCaseData] = useState<ITransformedData[]>([]);
  const [selectedStateDeathData, setSelectedStateDeathData] = useState<ITransformedData[]>([]);

  // States
  const [showDeaths, setShowDeaths] = useState(false);
  const [showStateDeaths, setStateShowDeaths] = useState(false);
  const [selectedState, setSelectedState] = useState<string>(states[0]);
  const [timePeriodSelectedState, setTimePeriodSelectedState] = useState<SelectableTimePeriods>("Last 100 days");

  // Functions to fetch data (4x)
  const loadAndTransformGermanyCaseData = async (days: number) => {
    // Reset Case Data
    setGermanyCaseData([]);
    // Fetch Data
    const caseData = await fetchGermanyCaseData(days);
    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    const transformedCaseData = caseData.data
      .map((value) => {
        return { value: value.cases, date: new Date(value.date) };
      })
      .filter((dataPoint) => {
        return ![0, 6].includes(dataPoint.date.getDay());
      });
    // Set Data
    setGermanyCaseData(transformedCaseData);
  }

  const loadAndTransformGermanyDeathData = async (days: number) => {
    // Reset Death Data
    setGermanyDeathData([]);
    // Fetch Data
    const deathData = await fetchGermanyDeathData(days);
    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    const transformedDeathData = deathData.data
      .map((value) => {
        return { value: value.deaths, date: new Date(value.date) };
      })
      .filter((dataPoint) => {
        return ![0, 6].includes(dataPoint.date.getDay());
      });
    // Set Data
    setGermanyDeathData(transformedDeathData);
  }

  const loadAndTransformSelectedStateCaseData = async (state: string, days: number) => {
    // Reset Case Data
    setSelectedStateCaseData([]);
    // Fetch Data
    const caseData = await fetchStateCaseData(state, days);
    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    if (caseData.data[selectedState as keyof TypeStateCasesData]) {
      const transformedCaseData = caseData.data[selectedState as keyof TypeStateCasesData]!.history
        .map((value) => {
          return { value: value.cases, date: new Date(value.date) };
        })
        .filter((dataPoint) => {
          return ![0, 6].includes(dataPoint.date.getDay());
        });
      // Set Data
      console.log("Case", transformedCaseData);
      setSelectedStateCaseData(transformedCaseData);
    }
  }

  const loadAndTransformSelectedStateDeathData = async (state: string, days: number) => {
    // Reset Case Data
    setSelectedStateDeathData([]);
    // Fetch Data
    const caseData = await fetchStateDeathData(state, days);
    // Transform casaData datestring to a Date object and skip dates from Sat and Sun to clean display of data
    if (caseData.data[selectedState as keyof TypeStateDeathsData]) {
      const transformedCaseData = caseData.data[selectedState as keyof TypeStateCasesData]!.history
        .map((value) => {
          return { value: value.deaths, date: new Date(value.date) };
        })
        .filter((dataPoint) => {
          return ![0, 6].includes(dataPoint.date.getDay());
        });
      // Set Data
      console.log("Death", transformedCaseData);
      setSelectedStateDeathData(transformedCaseData);
    }
  }

  // Reusable function to trigger reload of data for based on different states
  const reloadDataReducer = (period: SelectableTimePeriods, context: "Germany" | "SelectedState") => {
    switch (period) {
      case "Last 100 days":
        if (context === 'Germany') {
          loadAndTransformGermanyCaseData(100)
          loadAndTransformGermanyDeathData(100)
        } else {
          loadAndTransformSelectedStateCaseData(selectedState, 100);
          loadAndTransformSelectedStateDeathData(selectedState, 100);
          setTimePeriodSelectedState('Last 100 days')
        }
        break;
      case "Last Year":
        if (context === 'Germany') {
          loadAndTransformGermanyCaseData(365)
          loadAndTransformGermanyDeathData(365)
        } else {
          loadAndTransformSelectedStateCaseData(selectedState, 365);
          loadAndTransformSelectedStateDeathData(selectedState, 365);
          setTimePeriodSelectedState('Last Year')
        }
        break;

      case "Complete History":
        if (context === 'Germany') {
          loadAndTransformGermanyCaseData(0)
          loadAndTransformGermanyDeathData(0)
        } else {
          loadAndTransformSelectedStateCaseData(selectedState, 0);
          loadAndTransformSelectedStateDeathData(selectedState, 0);
          setTimePeriodSelectedState('Complete History')
        }
        break;
      default:
        break;
    }
  };

  // Load initial data when mounting
  useEffect(() => {
    async function onLoad() {
      try {
        const germanyData = await fetchGermanyOverviewData();
        setInformationGermany(germanyData);

        const stateData = await fetchStateOverviewData(selectedState);
        setInformationSelectedState(stateData);

        loadAndTransformGermanyCaseData(100);
        loadAndTransformGermanyDeathData(100);

        // Reuse Reducer for inital fetching of death and cases for default state
        reloadDataReducer(timePeriodSelectedState, 'SelectedState')

      } catch (e) {
        console.log(e);
      }
    }

    onLoad();
  }, []);

  // reload specified data when selected state changes
  useEffect(() => {

    async function loadStateData() {

      // Reset Basic State information
      setInformationSelectedState(null);
      const stateData = await fetchStateOverviewData(selectedState);
      setInformationSelectedState(stateData);

      // Reset State specific cases and deaths time series
      setSelectedStateCaseData([]);
      setSelectedStateDeathData([]);
      reloadDataReducer(timePeriodSelectedState, 'SelectedState')
    }

    loadStateData()


  }, [selectedState])


  // diagramm specific axis specifications
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

  return (
    <main className="h-full gap-2 p-4 pb-4 pl-18 pr-18 overflow-y-auto min-h-[40rem] min-w-[28rem]">
      {/* 
      UPPER PART

       */}
      <div className="bg-inherit w-full h-[100%] md:h-[50%] flex flex-col md:flex-row flex-wrap p-2">
        <div className="h-full flex-1 flex flex-col max-w-[100%] md:max-w-[50%]">
          <h1 className="text-2xl font-bold">
            Covid-19 Statistics - Germany Today
          </h1>
          <div className="flex-1 w-full max-h-full flex items-center justify-center flex-row flex-wrap p-2 gap-4 overflow-y-auto">
            {informationGermany ?
              <>
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
              </>
              : <span className="loading loading-ring loading-md"></span>}
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
              onChange={(e) => reloadDataReducer(e.target.value as SelectableTimePeriods, 'Germany')}
              className="select select-xs select-info w-full max-w-xs"
            >
              <option>Last 100 days</option>
              <option>Last Year</option>
              <option>Complete History</option>
            </select>
          </div>
          <div className="flex-1 m-2 items-center justify-center flex flex-row">
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
            ) : <span className="loading loading-ring loading-md"></span>}
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
                return (<option key={state}>{state}</option>)
              })}
            </select>
          </div>

          <div className="flex-1 w-full max-h-full flex items-center justify-center flex-row flex-wrap p-2 gap-4 overflow-y-auto">
            {informationSelectedState ?
              <>
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
                    informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.weekIncidence
                      ? parseInt(informationSelectedState.data[selectedState as keyof TypeStateCasesData]!.weekIncidence.toPrecision(2))
                      : 0
                  }
                  title="Week Incidence"
                  desc={`Yesterday: ${informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.delta.weekIncidence &&
                    informationSelectedState!.data[selectedState as keyof TypeStateCasesData]!.delta.weekIncidence > 0
                    ? "↗︎"
                    : "↘︎"
                    } ${informationSelectedState!.data[selectedState as keyof TypeStateCasesData]?.delta.weekIncidence.toPrecision(2)}`}
                ></StatsCard>
                <StatsCard
                  value={informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.recovered}
                  title="Recovered"
                  desc={`Recovered today: ${informationSelectedState?.data[selectedState as keyof TypeStateCasesData]?.delta.recovered}`}
                ></StatsCard>
              </>
              : <span className="loading loading-ring loading-md"></span>}
          </div>

        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="h-full flex-1 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Cases and Deaths - {selectedState}</h1>
            <div className="join">
              <button className={`btn join-item btn-sm ${!showStateDeaths && "btn-info"}`} onClick={() => setStateShowDeaths(false)}>Cases</button>
              <button className={`btn join-item btn-sm ${showStateDeaths && "btn-info"}`} onClick={() => setStateShowDeaths(true)}>Deaths</button>

            </div>
            <select
              defaultValue="Last 100 days"
              onChange={(e) => reloadDataReducer(e.target.value as SelectableTimePeriods, 'SelectedState')}
              className="select select-xs select-info w-full max-w-xs"
            >
              <option>Last 100 days</option>
              <option>Last Year</option>
              <option>Complete History</option>
            </select>
          </div>
          <div className="flex-1 m-2 items-center justify-center flex flex-row">
            {selectedStateCaseData.length > 0 && selectedStateDeathData.length > 0 ? (
              <Chart
                options={{
                  data: [{
                    label: "React Charts",
                    data: showStateDeaths ? selectedStateDeathData : selectedStateCaseData,
                  }],
                  primaryAxis,
                  secondaryAxes,
                  dark: true,
                }}
              />
            ) : <span className="loading loading-ring loading-md"></span>}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
