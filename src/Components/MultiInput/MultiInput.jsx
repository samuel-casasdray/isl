import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Input, Space, Tooltip } from "tiny-ui";

export default function MultiInput(props) {
	const [t] = useTranslation();
	const [value, setValue] = useState(["test", "t"]);
	const { Group, Addon } = Input;

	return (
		<Space direction="vertical" align="start" className="d-b">
			{value.map((v, i) => (
				<Group key={'groupinput_' + i}>
					<Input
						onChange={(e) => {
							let val = value;
							val[i] = e.target.value;
							setValue(val);
						}}
						type="text"
						defaultValue={v}
						key={'input_' + i}
					/>
					<Addon noBorder>
						<Tooltip title={t(props.type + ".remove")} placement="right" >
							<Button
								btnType="danger"
								style={{
									borderTopLeftRadius: 0,
									borderBottomLeftRadius: 0,
									marginRight: 0,
								}}
                                onClick={() => setValue(value.filter((_, ib) => {
                                    console.log(i, ib);
                                    console.log(value.filter((_, ib) => {
                                        console.log(i, ib);
                                        return i !== ib
                                    }))
                                    return i !== ib
                                }))}
							>
								<Icon name="close" />
							</Button>
						</Tooltip>
					</Addon>
				</Group>
			))}
			<Button
				icon={<Icon name="plus" />}
				color="primary"
				onClick={() => setValue([...value, ""])}
			>
				{t(props.type + ".add")}
			</Button>
		</Space>
	);
}
