package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperSort extends
		Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// sort these lines by decreasing absolute difference; this works because
	// there is only one reducer involved. If multiple reducers were to be used,
	// then this would piecewise-sort for each reducer and each reducer's output
	// would be contained in its own file.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Split the line into a vertex and absolute difference.
		String line = value.toString();
		String[] diff = line.split("\t");

		// Emit the difference all to a single reducer.
		context.write(new Text("foo"), new Text(diff[1]));
	}
}