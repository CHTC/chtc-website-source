import NextLink from "next/link";
import Box from "@mui/material/Box";
import Icon from "@/components/Header/Icon";

const Title = () => (
	<Box
		component={NextLink}
		href="/"
		aria-label="CHTC home"
		sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: { lg: 3, xs: 1 }, py: 1 }}
	>
		<Icon />
	</Box>
)

export default Title;
