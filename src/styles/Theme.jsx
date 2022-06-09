import { ThemeProvider } from "styled-components";
import themes from "./themes/default";
import GlobalStyles from "./globals";

const Theme = ({ children }) => (
	<ThemeProvider theme={themes}>
		<GlobalStyles />
		{children}
	</ThemeProvider>
);

export default Theme;
