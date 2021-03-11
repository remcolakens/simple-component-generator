import React from "react";
import styled from 'styled-components'
import IFILENAME from "./types";
import { Container, Row, Col, media } from 'styled-bootstrap-grid'

const FILENAME = styled.div`
  color: ${(props) => props.theme.colors.primary};

  ${media.md`
      color: ${(props) => props.theme.colors.secondary};
  `}
`

const FILENAME: React.FC<IFILENAME> = () => {
	return (
		<Container>
			<Row>
				<Col col xl={6} xs={12}>
					<FILENAME>
						Happy coding!
					</FILENAME>
				</Col>
			</Row>
		</Container>
	);
};

export default FILENAME;
