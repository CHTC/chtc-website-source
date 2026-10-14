import { readYaml } from '../_lib/docs';

interface Gpu {
  number_of_servers?: number | string;
  'number of servers'?: number | string;
  names?: string;
  gpus_per_server?: number | string;
  gpu_type?: string;
  hardware_generation?: number | string;
  gpu_memory?: string;
  owner?: string;
}

/**
 * The GPU Lab hardware table in the GPU jobs guide, generated from
 * `content/uw-research-computing/data/gpus.yaml` (legacy `_data/gpus.yaml`)
 * as the Liquid loop did: only the servers with the given owner.
 */
const GpuTable = ({ owner = 'campus' }: { owner?: string }) => {
  const gpus = readYaml<Gpu[]>('data/gpus.yaml').filter((gpu) => gpu.owner === owner);
  return (
    <div className='md-table-scroll'>
      <table className='gtable'>
        <thead>
          <tr>
            <th>Number of Servers</th>
            <th>Names</th>
            <th>GPUs / Server</th>
            <th>
              GPU Type (<code>DeviceName</code>)
            </th>
            <th>
              Hardware Generation <code>Capability</code>
            </th>
            <th>
              GPU Memory <code>GlobalMemoryMB</code>
            </th>
          </tr>
        </thead>
        <tbody>
          {gpus.map((gpu, index) => (
            <tr key={`${gpu.names}-${index}`}>
              {/* One entry in the data is keyed `number of servers` (Liquid printed it blank). */}
              <td>{gpu.number_of_servers ?? gpu['number of servers']}</td>
              <td>{gpu.names}</td>
              <td>{gpu.gpus_per_server}</td>
              <td>{gpu.gpu_type}</td>
              {/* YAML reads `6.0` as the number 6; compute capabilities print as x.y. */}
              <td>
                {typeof gpu.hardware_generation === 'number'
                  ? gpu.hardware_generation.toFixed(1)
                  : gpu.hardware_generation}
              </td>
              <td>{gpu.gpu_memory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GpuTable;
