import React, { CSSProperties } from "react";

/** The full-colour CHTC wordmark the legacy header used. */
const Icon = ({ size = "44px" }: { size?: CSSProperties['height'] }) => {
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src="/images/logos/CHTC_Logo_Full_Color.svg"
			alt="CHTC — Center for High Throughput Computing"
			style={{ height: size, width: "auto", display: 'block' }}
		/>
	);
};

export default Icon;
