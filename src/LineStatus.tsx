import React, { useEffect, useState } from "react";

interface LineStatus {
  line: {
    companyLineId: string;
    companySlug: string;
    name: string;
  };
  status: {
    name: string;
  };
}

interface LineStatuses {
  lineStatuses: LineStatus[];
  createdAt: string;
}

function LineStatus() {
  const [lineStatuses, setLineStatuses] = useState<LineStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api-subway-monitor-bb0c5df07afb.herokuapp.com/v1/verifications/last");
        const data: LineStatuses = await response.json();
        setLineStatuses(data.lineStatuses);
        setIsLoading(false);
      } catch (httpError) {
        setError("Error fetching line statuses. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {lineStatuses
        .sort((a, b) => parseInt(a.line.companyLineId, 10) - parseInt(b.line.companyLineId, 10))
        .map((lineStatus) => (
          <div key={lineStatus.line.companyLineId}>
            <p>
              Linha: {lineStatus.line.companyLineId} - {lineStatus.line.name}
            </p>
            <p>{lineStatus.status.name}</p>
            <hr />
          </div>
        ))}
    </div>
  );
}

export default LineStatus;
