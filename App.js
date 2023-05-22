import { StyleSheet, Text, View } from 'react-native';
import React, {Suspense, useRef, useState, lazy} from 'react'
import { Canvas, useFrame } from '@react-three/fiber/native'
import { useAssets } from 'expo-asset'
import { useGLTF } from '@react-three/drei'

function Box(props) {
	const mesh = useRef(null)
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	)
}

function ImportedModel({ localUri }) {
	const mesh = useGLTF(localUri, false, false)
	if (!mesh) return null
	return <primitive object={mesh} />
}

export default function App() {
	const [asset] = useAssets(require('./assets/suzanne.glb'))
	console.log(asset)
	return (
		<View style={styles.container}>
			<Text>Canvas</Text>
			<Canvas style={styles.canvas}>
				<color attach="background" args={['#26273A']} />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
				<Suspense>
					{ asset && <ImportedModel localUri={asset[0].uri} /> }
				</Suspense>
			</Canvas>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	canvas: {
		flex: 1/2,
		width: '100%',
		backgroundColor: '#555',
	}
})
