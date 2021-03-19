import React from "react";
import styled from "styled-components";
import IFILENAME from "./types";
import { Row, Col, media } from "styled-bootstrap-grid";

const StyledFILENAME = styled.div`
  color: ${(props) => props.theme.colors.primary};

  ${media.md`
      color: ${(props) => props.theme.colors.secondary};
  `}
`;

const FILENAME: React.FC<IFILENAME> = () => {
  return (
    <StyledFILENAME>
      <Row>
        <Col col xl={6} xs={12}>
          Happy coding!
        </Col>
      </Row>
    </StyledFILENAME>
  );
};

export default FILENAME;
