import { Select } from "antd";
import { Cluster, CLUSTERS } from "src/utils/config";


interface Props {
  value?: Cluster[];
  onChange?: (clusters: Cluster[]) => void;
}

export const ClusterSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Select
      mode="multiple"
      labelInValue
      placeholder="请选择集群"
      value={value ? value.map((v) => ({ value: v.id, label: v.name })) : undefined}
      onChange={(values) => onChange?.(values.map((x) => ({ id: x.value, name: x.label })))}
      options={CLUSTERS.map((x) => ({ value: x.id, label: x.name }))}
    />
  );
};

interface SingleSelectionProps {
  value?: Cluster;
  onChange?: (cluster: Cluster) => void;
}

export const SingleClusterSelector: React.FC<SingleSelectionProps> = ({ value, onChange }) => {
  return (
    <Select
      labelInValue
      placeholder="请选择集群"
      value={value ? ({ value: value.id, label: value.name }) : undefined}
      onChange={({ value, label }) => onChange?.({ id: value, name: label })}
      options={CLUSTERS.map((x) => ({ value: x.id, label: x.name }))}
    />
  );
};
