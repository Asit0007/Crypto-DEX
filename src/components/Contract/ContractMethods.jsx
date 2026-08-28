import { Button, Card, Form, Input } from "antd";
import Text from "antd/lib/typography/Text";

/**
 * viem decodes uint/int returns as BigInt, which plain JSON.stringify throws
 * on — so serialise those to strings on the way out.
 */
const stringifyResult = (result) =>
  JSON.stringify(result, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

const ContractMethods = ({ displayedContractFunctions, responses }) => {
  return displayedContractFunctions.map((item, key) => {
    const response = responses[item.name];
    const hasResult =
      response && response.result !== null && response.result !== undefined;

    return (
      <Card
        title={`${key + 1}. ${item?.name}`}
        size="small"
        style={{ marginBottom: "20px" }}
        key={key}
      >
        <Form layout="vertical" name={`${item.name}`}>
          {item.inputs.map((input, key) => (
            <Form.Item
              label={`${input.name} (${input.type})`}
              name={`${input.name}`}
              required
              style={{ marginBottom: "15px" }}
              key={key}
            >
              <Input placeholder="input placeholder" />
            </Form.Item>
          ))}
          <Form.Item style={{ marginBottom: "5px" }}>
            <Text style={{ display: "block" }}>
              {hasResult && `Response: ${stringifyResult(response.result)}`}
            </Text>
            <Button
              type="primary"
              htmlType="submit"
              loading={response?.isLoading}
            >
              {["view", "pure"].includes(item.stateMutability)
                ? "Read🔎"
                : "Transact💸"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  });
};

export default ContractMethods;
