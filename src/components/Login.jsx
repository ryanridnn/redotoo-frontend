import styled from "styled-components";
import Logo from "../assets/logo.svg?component";

const Login = () => {
	const openAuth = () => {
		window.open(import.meta.env.VITE_SERVER_URL + "/auth/google", "_self");
	};

	return (
		<Wrapper>
			<LoginBox>
				<Logo />
				<Title>Hello, Let's Login</Title>
				<Text>Login to enter this todo app build with MERN Stack</Text>
				<LoginButton onClick={openAuth}>Login with Google</LoginButton>
			</LoginBox>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	min-height: 100vh;
`;

const LoginBox = styled.div`
	padding: 1.5rem;
	border-radius: 1rem;
	background: ${(props) => props.theme.colors.neutral.n1};
	width: 560px;
	max-width: 100%;
`;

// const Logo = styled.div``;

const Title = styled.h1`
	font-size: 1.5rem;
	font-family: ${(props) => props.theme.fonts.title};
	margin: 1.25rem 0 0.5rem;
`;

const Text = styled.p`
	color: ${(props) => props.theme.colors.text.n2};
`;

const LoginButton = styled.button`
	margin-top: 1.75rem;
	border: none;
	background: ${(props) => props.theme.colors.secondary.main};
	color: ${(props) => props.theme.colors.neutral.n1};
	padding: 1rem;
	width: 100%;
	font-weight: medium;
	font-family: ${(props) => props.theme.fonts.title};
	border-radius: 0.375rem;
	transition: transform 0.15s ease, background 0.15s ease;

	&:hover {
		transform: scale(0.97);
	}

	&:focus {
		background: ${(props) => props.theme.colors.secondary.mainActive};
	}
`;

export default Login;
