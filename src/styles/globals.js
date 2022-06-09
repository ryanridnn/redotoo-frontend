import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyles = createGlobalStyle`
 	${normalize};
 	*{
 		padding: 0;
 		margin: 0;
 		box-sizing: border-box;
 		font-family: ${(props) => props.theme.fonts.main}
 	}

 	body {
 		background: ${(props) => props.theme.colors.neutral.n3}
 	}

 	button{
 		cursor: pointer;
 	}

 	.color{
 		color: red;
 	}
`;

export default GlobalStyles;
