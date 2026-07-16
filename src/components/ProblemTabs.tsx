import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

type Props = {
  implementation: string;
  tests: string;
  implLang?: string;
  testLang?: string;
};


export default function ProblemTabs({ implementation, tests, implLang = 'js', testLang = 'ts' }: Props) {
  return (
    <Tabs>
      <TabItem value="implementation" label="Implementation">
        <CodeBlock language={implLang}>{implementation}</CodeBlock>
      </TabItem>
      <TabItem value="tests" label="Tests">
        <CodeBlock language={testLang}>{tests}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
